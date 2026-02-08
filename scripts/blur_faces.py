print("🚀 [1단계] 스크립트가 시작되었습니다!") 

import os
import glob
import sys

print("📦 [2단계] 필요한 도구(라이브러리)를 불러오는 중...")

try:
    import cv2
    print("✅ OpenCV 라이브러리 로드 성공!")
except ImportError as e:
    print(f"❌ [치명적 오류] OpenCV를 찾을 수 없습니다: {e}")
    print("👉 터미널에 'python -m pip install opencv-python-headless'를 입력해서 설치해주세요.")
    sys.exit(1)

# 설정
BLUR_INTENSITY = 99 

def blur_faces():
    print("📂 [3단계] 이미지 폴더를 찾는 중...")
    
    # 현재 위치 확인
    current_dir = os.getcwd()
    print(f"   👉 현재 작업 위치: {current_dir}")
    
    # 이미지 폴더 경로 (절대 경로로 변환)
    img_dir = os.path.join(current_dir, 'public', 'images')
    print(f"   👉 사진 폴더 목표 위치: {img_dir}")

    if not os.path.exists(img_dir):
        print("❌ [오류] 'public/images' 폴더를 찾을 수 없습니다!")
        print("   혹시 'scripts' 폴더 안에서 실행하셨나요? 'cd ..'를 입력해서 상위 폴더로 이동 후 다시 실행해보세요.")
        return

    # 얼굴 인식 모델 로딩
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    face_cascade = cv2.CascadeClassifier(cascade_path)

    # 이미지 파일 찾기
    types = ('*.jpg', '*.jpeg', '*.png', '*.JPG', '*.HEIC')
    files = []
    for ext in types:
        files.extend(glob.glob(os.path.join(img_dir, ext)))

    print(f"📸 [4단계] 총 {len(files)}장의 사진을 발견했습니다.")

    if len(files) == 0:
        print("⚠️ 폴더는 찾았는데 사진 파일이 하나도 없네요? 확장자(.jpg, .png)를 확인해보세요.")
        return

    count = 0
    processed_files = 0
    
    print("🏃 [5단계] 얼굴 인식 및 모자이크 시작!")
    
    for file_path in files:
        img = cv2.imread(file_path)
        if img is None:
            continue
            
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) > 0:
            count += len(faces)
            processed_files += 1
            print(f"   🔍 {os.path.basename(file_path)}: 얼굴 {len(faces)}개 발견 -> 변환 중")
            
            for (x, y, w, h) in faces:
                roi = img[y:y+h, x:x+w]
                roi = cv2.GaussianBlur(roi, (BLUR_INTENSITY, BLUR_INTENSITY), 30)
                img[y:y+h, x:x+w] = roi
            
            cv2.imwrite(file_path, img)

    print("-" * 30)
    print(f"✨ [완료] 사진 {processed_files}장에서 얼굴 {count}개를 지웠습니다.")

if __name__ == "__main__":
    blur_faces()