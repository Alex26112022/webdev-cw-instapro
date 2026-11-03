import { uploadImage } from '../api.js';

/**
 * Компонент загрузки изображения.
 * Этот компонент позволяет пользователю загружать изображение и отображать его превью.
 * Если изображение уже загружено, пользователь может заменить его.
 *
 * @param {HTMLElement} params.element - HTML-элемент, в который будет рендериться компонент.
 * @param {Function} params.onImageUrlChange - Функция, вызываемая при изменении URL изображения.
 *                                            Принимает один аргумент - новый URL изображения или пустую строку.
 */
export function renderUploadImageComponent({ element, onImageUrlChange }) {
  let imageUrl = '';

  const render = () => {
    element.innerHTML = `
      <div class="upload-image">
        ${
          imageUrl
            ? `
            <div class="file-upload-image-container">
              <img class="file-upload-image" src="${imageUrl}" alt="Загруженное изображение">
              <button class="file-upload-remove-button button">Заменить фото</button>
            </div>
            `
            : `
            <label class="file-upload-label secondary-button">
              <input
                type="file"
                class="file-upload-input"
                style="display:none"
              />
              Выберите фото
            </label>
          `
        }
      </div>
    `;

    const fileInputElement = element.querySelector('.file-upload-input');
    fileInputElement?.addEventListener('change', () => {
      const file = fileInputElement.files[0];
      if (file) {
        const labelEl = element.querySelector('.file-upload-label');
        labelEl?.setAttribute('disabled', true);
        if (labelEl) labelEl.textContent = 'Загружаю файл...';

        uploadImage({ file })
          .then(({ fileUrl }) => {
            imageUrl = fileUrl;
            onImageUrlChange(imageUrl);
            render();
          })
          .catch((error) => {
            console.error(error);
            alert('Не удалось загрузить изображение.');
            imageUrl = '';
            onImageUrlChange(imageUrl);
            render();
          });
      }
    });

    element
      .querySelector('.file-upload-remove-button')
      ?.addEventListener('click', () => {
        imageUrl = '';
        onImageUrlChange(imageUrl);
        render();
      });
  };

  render();
}
