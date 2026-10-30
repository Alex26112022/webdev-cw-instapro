import { renderHeaderComponent } from './header-component.js';
import { renderUploadImageComponent } from './upload-image-component.js';

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    let imageUrl = '';

    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Новый пост</h3>
        <div class="form-inputs">
          <input type="text" id="post-description" class="input" placeholder="Подпись к фото" />
          <div class="upload-image-container"></div>
          <div class="form-error"></div>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: appEl.querySelector('.header-container'),
    });

    const uploadImageContainer = appEl.querySelector('.upload-image-container');
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    const setError = (message) => {
      appEl.querySelector('.form-error').textContent = message;
    };

    document.getElementById('add-button').addEventListener('click', () => {
      setError('');
      const description = document
        .getElementById('post-description')
        .value.trim();

      if (!description) {
        setError('Введите описание поста');
        return;
      }
      if (!imageUrl) {
        setError('Выберите фото');
        return;
      }

      onAddPostClick({ description, imageUrl });
    });
  };

  render();
}
