import cv2 as cv
import numpy as np

HSV_ADJUSTMENT = True


def fancy_hsv_move(image):
    hsv_image = cv.cvtColor(image, cv.COLOR_BGR2HSV)

    # Step 3: Define lower and upper bounds for red color in HSV
    # Red can be tricky in HSV because it wraps around, so we define two ranges for red.
    lower_red_1 = np.array([0, 50, 50])   # First range of red
    upper_red_1 = np.array([15, 255, 255])
    lower_red_2 = np.array([160, 50, 50]) # Second range of red
    upper_red_2 = np.array([180, 255, 255])

    lower_rest = np.array([15, 50, 50])
    upper_rest = np.array([160, 255, 255])

    # Step 4: Create masks for red areas in both ranges
    mask1 = cv.inRange(hsv_image, lower_red_1, upper_red_1)
    mask2 = cv.inRange(hsv_image, lower_red_2, upper_red_2)
    mask = mask1 + mask2  # Combine both masks

    
    # Step 5: Increase the brightness (Value channel) of the red areas
    h, s, v = cv.split(hsv_image)  # Split HSV channels
    v[mask > 0] = np.clip(v[mask > 0] + 10, 0, 255)  # Increase value channel in red areas
    s[mask > 0] = np.clip(s[mask > 0] - 10, 0, 255)

    # Step 6: Merge channels back
    brightened_hsv = cv.merge([h, s, v])


    # Step 7: Make rest darker
    mask3 = cv.inRange(brightened_hsv, lower_rest, upper_rest)
    h, s, v = cv.split(brightened_hsv)  # Split HSV channels
    v[mask3 > 0] = np.clip(v[mask3 > 0] - 10, 0, 255)  # Increase value channel in red areas
    # s[mask3 > 0] = np.clip(s[mask3 > 0] - 20, 0, 255)

    # Step 8: Merge channels back and convert to BGR
    result_hsv = cv.merge([h, s, v])
    image = cv.cvtColor(result_hsv, cv.COLOR_HSV2BGR)

    return image


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


# Adjust the hue, saturation, and value of the image 
def adjust_hsv(image):
    image = cv.cvtColor(image, cv.COLOR_BGR2HSV)

    # Adjusts the hue by multiplying it by 0.7 
    image[:, :, 0] = image[:, :, 0] * 0.7
    # Adjusts the saturation by multiplying it by 1.5 
    image[:, :, 1] = image[:, :, 1] * 1.5
    # Adjusts the value by multiplying it by 0.5 
    image[:, :, 2] = image[:, :, 2] * 0.5

    new_image = cv.cvtColor(image, cv.COLOR_HSV2BGR)
    return new_image


def denoise_and_enhance(image):
    image = cv.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21)
    return image


def denoise(image):
    image = cv.medianBlur(image, 3)
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



def brighten_color_range(image, lower_bound, upper_bound, value):
        # Define the lower and upper bounds for the color range (BGR format)
    lower_bound = np.array([0, 0, 210])      # BGR for (255, 0, 0)
    upper_bound = np.array([150, 150, 255])    # BGR for (255, 20, 20)

    # Create a mask for areas that fall within the desired red range
    mask = cv.inRange(image, lower_bound, upper_bound)

    # Create a copy of the original image to avoid altering the original data
    brightened_image = image.copy()

    #  Increase brightness in the masked area
    value = 150
    brightened_image[mask > 0] = np.clip(brightened_image[mask > 0] + value, 0, 255)
    return brightened_image



def less_blue(image):
    # Define the lower and upper bounds for the color range (BGR format)
    lower_bound = np.array([210, 0, 0])  
    upper_bound = np.array([255, 127, 127])
    value = -150
    new_image = brighten_color_range(image, lower_bound, upper_bound, value)
    return new_image


def less_green(image): 
    # Define the lower and upper bounds for the color range (BGR format)
    lower_bound = np.array([0, 210, 0])  
    upper_bound = np.array([127, 255, 127])
    value = -150
    new_image = brighten_color_range(image, lower_bound, upper_bound, value)
    return new_image


def more_red(image):
    # Define the lower and upper bounds for the color range (BGR format)
    lower_bound = np.array([0, 0, 210])      # BGR for (255, 0, 0)
    upper_bound = np.array([150, 150, 255])    # BGR for (255, 20, 20)
    value = 100

    new_image = brighten_color_range(image, lower_bound, upper_bound, value)
    return new_image



def enchance(file_buffer):
    image = get_opencv_img_from_buffer(file_buffer, cv.IMREAD_COLOR)


    image = invert(image)

    image = sharpness(image)
    image = bright_contrast(image)

    image = invert(image)

    # if HSV_ADJUSTMENT:
    #     image = adjust_hsv(image)

    # image = more_red(image)
    # image = less_blue(image)

    # image = denoise(image)

    # cv.imshow("Display window", image)
    # cv.waitKey()
    # cv.destroyAllWindows()
    return image


def enhance_to_bytes(file_buffer):
    image = enchance(file_buffer)
    return cv.imencode('.png', image)[1].tobytes()



def enchance_and_save(file_buffer, save_path):
    image = enchance(file_buffer)
    # Save the enhanced image
    cv.imwrite(save_path, image)
    