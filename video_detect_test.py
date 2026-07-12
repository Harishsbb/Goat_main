from video_detect import tag_detection
# test  for no tag
def test_no_tag():
    result = tag_detection("./uploads/no tag.mp4")
    assert result == {}


# test for single tag
def test_single_tag():
    result = tag_detection("./uploads/singletag.mp4")
    assert len(result) == 1


# test for multiple tags
def test_multiple_tags():
    result = tag_detection("./uploads/multiple_tag.mp4")

    print("Detected Tags:", list(result.keys()))
    print("Length:", len(result))

    assert len(result) == 2


# test for tag id
def test_tag_id():
    result = tag_detection("./uploads/multiple_tag.mp4")
    assert 3 not  in result
    assert 50 in result

# test for tag timelapse
def test_tag_timelapse():
    result= tag_detection("./uploads/multiple_tag.mp4")
    assert "4.37" in result[50] 

# test for tag coordinates
def test_coordinate_test():
    result = tag_detection("./uploads/multiple_tag.mp4")
    assert result[50]["4.37"] == [767, 463]
