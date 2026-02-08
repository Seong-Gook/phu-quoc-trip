import pandas as pd
import os
import json
import re
import sys
from datetime import datetime, timedelta
from PIL import Image
from PIL.ExifTags import TAGS

# ---------------------------------------------------------
# 설정: 한 일정당 최대 사진 개수
MAX_PHOTOS_PER_ACTIVITY = 15
# ---------------------------------------------------------

def parse_date_string(date_str):
    """ 다양한 날짜 형식(2026-01-21, 2026.1.21 등)을 처리 """
    date_str = str(date_str).strip()
    try:
        # 1. 기본 포맷 YYYY-MM-DD
        return datetime.strptime(date_str, "%Y-%m-%d").strftime("%Y-%m-%d")
    except:
        pass
    try:
        # 2. 엑셀 등에서 변형된 포맷 YYYY. M. D
        date_str = date_str.replace('.', '-').replace(' ', '')
        # 2026-1-21 같은 경우도 처리됨
        return datetime.strptime(date_str, "%Y-%m-%d").strftime("%Y-%m-%d")
    except:
        return None

def get_image_timestamp(filepath):
    filename = os.path.basename(filepath)
    
    # 1. 파일명에서 숫자만 추출 (언더바, 공백 제거)
    digits = ''.join(filter(str.isdigit, filename))
    
    # 2. 202로 시작하는 12자리 이상 숫자 찾기
    match = re.search(r'(202\d{9,})', digits)
    if match:
        d = match.group(1)
        try:
            if len(d) >= 14: # 초 단위까지
                return datetime.strptime(d[:14], "%Y%m%d%H%M%S")
            elif len(d) >= 12: # 분 단위까지
                return datetime.strptime(d[:12] + "00", "%Y%m%d%H%M%S")
        except:
            pass
            
    # 3. EXIF 시도 (파일명 실패 시)
    try:
        image = Image.open(filepath)
        exif = image._getexif()
        if exif:
            for tag, value in exif.items():
                if TAGS.get(tag) == 'DateTimeOriginal':
                    return datetime.strptime(value, '%Y:%m:%d %H:%M:%S')
    except:
        pass

    return None

def build():
    print(f"🚀 데이터 빌드 시작! (현재 위치: {os.getcwd()})")

    # 1. CSV 파일 로드 확인
    csv_path = 'data/schedule.csv'
    if not os.path.exists(csv_path):
        print(f"❌ 오류: '{csv_path}' 파일이 없습니다! 경로를 확인하세요.")
        return

    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"❌ 오류: CSV 파일을 읽을 수 없습니다. ({e})")
        return

    # 2. 일정 데이터 전처리 (datetime 객체로 미리 변환)
    activities = []
    for idx, row in df.iterrows():
        try:
            d_str = parse_date_string(row['Date'])
            if not d_str: continue

            s_str = str(row['Start_Time']).strip()
            e_str = str(row['End_Time']).strip()
            if e_str == "24:00": e_str = "23:59"

            # 시작/종료 시간 datetime 생성
            start_dt = datetime.strptime(f"{d_str} {s_str}", "%Y-%m-%d %H:%M")
            end_dt = datetime.strptime(f"{d_str} {e_str}", "%Y-%m-%d %H:%M")

            activities.append({
                "id": idx,
                "date": d_str,
                "start": s_str,
                "end": e_str,
                "start_dt": start_dt,
                "end_dt": end_dt,
                "title": str(row['Activity']).strip(),
                "images": []
            })
        except Exception as e:
            print(f"⚠️ 일정 파싱 경고 (행 {idx}): {e}")
            continue

    print(f"📅 일정 {len(activities)}개를 로드했습니다.")

    # 3. 이미지 스캔
    img_dir = 'public/images'
    if not os.path.exists(img_dir):
        print(f"❌ 오류: '{img_dir}' 폴더가 없습니다.")
        return

    files = [f for f in os.listdir(img_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.heic'))]
    print(f"📸 사진 {len(files)}장을 분석합니다...")

    matched_count = 0
    gap_filled_count = 0
    
    # 디버깅용: 첫 3개 파일만 로그 출력
    debug_limit = 3 

    for i, f in enumerate(files):
        path = os.path.join(img_dir, f)
        ts = get_image_timestamp(path)
        
        # 디버깅 로그
        is_debug = i < debug_limit
        if is_debug:
            print(f"   🔍 [Debug] {f} -> 시간: {ts}")

        if not ts:
            if is_debug: print(f"      ❌ 시간 파싱 실패")
            continue

        # --- 매칭 로직 시작 ---
        best_act = None
        min_diff = float('inf') # 시간 차이 (초)

        # 1. 같은 날짜의 일정만 필터링
        day_acts = [act for act in activities if act['date'] == ts.strftime("%Y-%m-%d")]

        if not day_acts:
            if is_debug: print(f"      ❌ 해당 날짜({ts.date()})에 일정이 없음")
            continue

        # 2. 정확한 범위 포함 여부 확인 (Strict Match)
        matched_strictly = False
        for act in day_acts:
            if act['start_dt'] <= ts <= act['end_dt']:
                act['images'].append(f"/images/{f}")
                matched_strictly = True
                matched_count += 1
                if is_debug: print(f"      ✅ 정확히 매칭됨: {act['title']}")
                break
        
        # 3. 범위 밖이라면? 가장 가까운 일정 찾기 (Gap Filling)
        if not matched_strictly:
            for act in day_acts:
                # 시작 시간과의 차이, 종료 시간과의 차이 중 더 작은 것
                diff_start = abs((ts - act['start_dt']).total_seconds())
                diff_end = abs((ts - act['end_dt']).total_seconds())
                current_min = min(diff_start, diff_end)

                if current_min < min_diff:
                    min_diff = current_min
                    best_act = act
            
            # 가장 가까운 곳에 배정 (단, 3시간 이내 차이일 때만)
            if best_act and min_diff < 10800: # 3시간(10800초) 이내
                best_act['images'].append(f"/images/{f}")
                gap_filled_count += 1
                if is_debug: print(f"      🧲 빈틈 채우기: {best_act['title']} (차이: {int(min_diff/60)}분)")
            else:
                if is_debug: print(f"      ❌ 너무 멀어서 버림 (가장 가까운 것도 {int(min_diff/60)}분 차이)")

    # 4. 결과 저장
    final_data = []
    for act in activities:
        # 최대 개수 제한 (여기서 자름)
        visible_images = act['images'][:MAX_PHOTOS_PER_ACTIVITY]
        
        final_data.append({
            "date": act['date'],
            "start": act['start'],
            "end": act['end'],
            "title": act['title'],
            "images": visible_images
        })
        
        if len(act['images']) > 0:
            print(f"   📂 [{act['date']}] {act['title'][:10]}... : {len(act['images'])}장")

    with open('data/trip_data.json', 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)

    print("-" * 30)
    print(f"✨ 완료! 정매칭 {matched_count}장 + 빈틈채우기 {gap_filled_count}장")
    print(f"   총 {matched_count + gap_filled_count}장의 사진이 웹사이트에 표시됩니다.")

if __name__ == "__main__":
    build()