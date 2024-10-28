import cv2 as cv
import numpy as np

HSV_ADJUSTMENT = True

def get_opencv_img_from_buffer(buffer, flags):
    bytes_as_np_array = np.frombuffer(buffer.read(), dtype=np.uint8)
    return cv.imdecode(bytes_as_np_array, flags)


def invert(image):
    image = cv.bitwise_not(image)
    return image


def sharpness(image):
    kernel = np.array([
        [0, -1, 0],
        [-1, 5, -1], 
        [0, -1, 0]
    ])
    image = cv.filter2D(image, -1, kernel) 
    return image    


def bright_contrast(image):
    # Adjust the brightness and contrast  
    # g(i,j)=α⋅f(i,j)+β 
    # control Contrast by alpha 
    alpha = 2.8
    # control brightness by beta
    beta = -120  
    image = cv.convertScaleAbs(image, alpha=alpha, beta=beta) 
    return image


def enhance(file_buffer):
    image = get_opencv_img_from_buffer(file_buffer, cv.IMREAD_COLOR)

    image = invert(image)

    image = sharpness(image)
    image = bright_contrast(image)

    image = invert(image)

    # if HSV_ADJUSTMENT:
    #     image = adjust_hsv(image)

    # cv.imshow("Display window", image)
    # cv.waitKey()
    # cv.destroyAllWindows()
    return image


def enhance_to_bytes(file_buffer):
    image = enhance(file_buffer)
    return cv.imencode('.png', image)[1].tobytes()


def enhance_and_save(file_buffer, save_path):
    image = enhance(file_buffer)
    # Save the enhanced image
    cv.imwrite(save_path, image)
    