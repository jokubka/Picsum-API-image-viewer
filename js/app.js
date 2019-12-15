const fetchData = async () => {
  const response = await fetch("https://picsum.photos/v2/list");
  const image_data = await response.json();
  return image_data;
};

const scaleImage = (view_w, view_h, image_w, image_h) => {
  let ratio = null;
  let scaled_image = {};
  if (image_w > image_h) {
    ratio = image_w / image_h;
    scaled_image = {
      width: view_w,
      height: Math.floor(view_w / ratio)
    };
    if (scaled_image.height > view_h) {
      scaled_image = {
        width: Math.floor(view_h * ratio),
        height: view_h
      };
    }
  } else {
    ratio = image_h / image_w;
    scaled_image = {
      width: Math.floor(view_h / ratio),
      height: view_h
    };
    if (scaled_image.width > view_w) {
      scaled_image = {
        width: view_w,
        height: Math.floor(view_w * ratio)
      };
    }
  }
  return scaled_image;
};

const imageOptimizer = (image_data, image_id) => {
  const image_viewport = document.querySelector(".image-viewport");
  const viewport_width = image_viewport.offsetWidth - 50;
  const viewport_height = image_viewport.offsetHeight - 100;
  const image_original_width = image_data[image_id].width;
  const image_original_height = image_data[image_id].height;
  const image_scaled = scaleImage(
    viewport_width,
    viewport_height,
    image_original_width,
    image_original_height
  );

  return image_scaled;
};

const spinnerHandler = () => {
  const preview_spinner = document.querySelector(".preview-spinner");
  const photo_spinner = document.querySelector(".photo-spinner");

  if (preview_spinner.classList.contains("show")) {
    preview_spinner.classList.remove("show");
  }

  photo_spinner.classList.remove("show");
};

const showImageHandler = (event, image_data) => {
  const image_id = event.target.dataset.imageId;
  const image_element = document.querySelector(".enlarged-image__image");
  const author_element = document.querySelector(".image-author");
  const size_element = document.querySelector(".image-size");
  const image_size = imageOptimizer(image_data, image_id);
  const photo_spinner = document.querySelector(".photo-spinner");

  photo_spinner.classList.add("show");
  author_element.innerHTML = image_data[image_id].author;
  size_element.innerHTML = `${image_data[image_id].width} X ${image_data[image_id].height}`;
  image_element.innerHTML = `<img src="https://picsum.photos/id/${image_data[image_id].id}/${image_size.width}/${image_size.height}" alt="Enlarged Image" class="photo"/>`;
  eventHandlerGenerator(image_data);
};

const eventHandlerGenerator = image_data => {
  const image_list = document.querySelectorAll(".preview-section__image");
  const photo = document.querySelector(".photo");

  image_list.forEach(item =>
    item.addEventListener("click", event => {
      showImageHandler(event, image_data);
    })
  );

  photo.addEventListener("load", spinnerHandler);
};

const loadFirstImage = image_data => {
  const author_element = document.querySelector(".image-author");
  const size_element = document.querySelector(".image-size");
  const image_element = document.querySelector(".enlarged-image__image");
  const image_size = imageOptimizer(image_data, 0);

  author_element.innerHTML = image_data[0].author;
  size_element.innerHTML = `${image_data[0].width} X ${image_data[0].height}`;
  image_element.innerHTML = `<img src="https://picsum.photos/id/${image_data[0].id}/${image_size.width}/${image_size.height}" alt="Enlarged Image" class="photo" />`;
};

const generateHtml = image_data => {
  const html = image_data
    .map(
      (item, index) =>
        `<img
            src="https://picsum.photos/id/${item.id}/200/200"
            alt="Preview Image"
            class="preview-section__image"
            data-image-id=${index}
          />`
    )
    .join("");

  return html;
};

const loadPreview = async () => {
  const preview_Section = document.querySelector(".sidebar__preview-section");
  const image_data = await fetchData();
  const html_output = generateHtml(image_data);

  preview_Section.innerHTML = html_output;
  loadFirstImage(image_data);
  eventHandlerGenerator(image_data);
};

loadPreview();
