import cv2
from pupil_apriltags import Detector
import json
import sys


detector = Detector(families="tag36h11")
# print(detector)
# function to detect AprilTags in a video and return their center coordinates with timestamps
def tag_detection(video_path):
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("Error: Could not open video.")
        return {}

    tags_data = {}
    # print(tags_data)
    while True:

        ret, frame = cap.read()

        if not ret:
            print("Video completed.", file=sys.stderr)
            break

        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect all AprilTags in the current frame
        detections = detector.detect(gray)


#json for storing the tag data with timestamps
        for tag in detections:
            # print(tags_data)
                # Print each tag individually
            # print("Detected Tag:", tag.tag_id)
            if tag.tag_id not in tags_data:
                tags_data[tag.tag_id] = {}

            tag_time = tags_data[tag.tag_id]
            x = int(tag.center[0])
            y = int(tag.center[1])
            
            tag_time[str(round(cap.get(cv2.CAP_PROP_POS_MSEC)/1000, 2))] = [x, y]

    
    # if tags_data:
        #    print(json.dumps(tags_data, indent=4))

    cap.release()   
    cv2.destroyAllWindows()
    return tags_data
    # print(result)``

#main function to run the tag detection on a video file and save the results to a JSON file
if __name__ == "__main__":
    video_path = sys.argv[1]

    result = tag_detection(video_path)

    with open("tags_data.json", "w") as file:
        json.dump(result, file, indent=4)

    print(json.dumps(result, indent=4))