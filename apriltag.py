import cv2
from pupil_apriltags import Detector
import json

detector = Detector(families="tag36h11")

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    detections = detector.detect(gray)

    tags_data = []

    for tag in detections:
        x, y = map(int, tag.center)

        tag_info = {
            "tag_id": tag.tag_id,
            "center_x": x,
            "center_y": y
        }

        tags_data.append(tag_info)

        cv2.putText(
            frame,
            f"ID: {tag.tag_id}",
            (x, y - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (255, 0, 0),
            2
        )

        corners = tag.corners.astype(int)

        for i in range(4):
            pt1 = tuple(corners[i])
            pt2 = tuple(corners[(i + 1) % 4])

            cv2.line(frame, pt1, pt2, (0, 255, 0), 2)

        cv2.circle(frame, (x, y), 5, (0, 0, 255), -1)
    if tags_data:
        print(json.dumps(tags_data, indent=4))

    cv2.imshow("Center Point", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()