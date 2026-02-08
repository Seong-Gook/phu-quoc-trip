import cv2
import os
import glob

# 모자이크 강도 (홀수만 가능: 99는 아주 강하게)
BLUR_INTENSITY = 99 

def blur_faces():
    # 1. 사진 폴더 위치
    img_dir = os.path.join('public', 'images')
    
    # 2. 얼굴 인식 AI 로딩 (OpenCV 기본 모델)
    try:
        cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        face_cascade = cv2.CascadeClassifier(cascade_path)
    except:
        print("❌ 얼굴 인식 모델 로딩 실패. opencv-python-headless가 설치되었나요?")
        return

    # 3. 이미지 파일 찾기
    types = ('*.jpg', '*.jpeg', '*.png', '*.JPG', '*.HEIC')
    files = []
    for ext in types:
        files.extend(glob.glob(os.path.join(img_dir, ext)))

    print(f"📸 총 {len(files)}장의 사진을 스캔합니다...")

    count = 0
    processed_files = 0
    
    for file_path in files:
        # 이미지 읽기
        img = cv2.imread(file_path)
        if img is None:
            continue
            
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 얼굴 찾기
        faces = face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) > 0:
            count += len(faces)
            processed_files += 1
            print(f"🔍 {os.path.basename(file_path)}: 얼굴 {len(faces)}개 발견! -> 모자이크 처리")
            
            for (x, y, w, h) in faces:
                # 얼굴 영역 추출 & 모자이크
                roi = img[y:y+h, x:x+w]
                roi = cv2.GaussianBlur(roi, (BLUR_INTENSITY, BLUR_INTENSITY), 30)
                img[y:y+h, x:x+w] = roi
            
            # 파일 저장
            cv2.imwrite(file_path, img)

    print("-" * 30)
    print(f"✨ 완료! 사진 {processed_files}장에서 얼굴 {count}개를 지웠습니다.")

if __name__ == "__main__":
    blur_faces()