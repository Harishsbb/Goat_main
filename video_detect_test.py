from video_detect import tag_detection

def test_no_tag():
    result = tag_detection("./uploads/no tag.mp4")
    assert result == {}



def test_single_tag():
    result = tag_detection("./uploads/singletag.mp4")
    assert len(result) == 1



def test_multiple_tags():
    result = tag_detection("./uploads/multiple_tag.mp4")

    print("Detected Tags:", list(result.keys()))
    print("Length:", len(result))

    assert len(result) == 2



def test_tag_id():
    result = tag_detection("./uploads/multiple_tag.mp4")
    assert 3 not  in result
    assert 50 in result

def test_tag_timelapse():
    result= tag_detection("./uploads/multiple_tag.mp4")
    assert "4.37" in result[50] 


def test_coordinate_test():
    result = tag_detection("./uploads/multiple_tag.mp4")
    assert result[50]["4.37"] == [767, 463]
