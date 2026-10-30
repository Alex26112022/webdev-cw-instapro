import format from '../format.js';
import { escapeHtml, getUserFromLocalStorage } from '../helpers.js';
import { goToPage, posts, removePost, toLike } from '../index.js';
import { USER_POSTS_PAGE } from '../routes.js';
import { renderHeaderComponent } from './header-component.js';

window.__localeId__ = 'ru';

function renderPostTemplate(post, { showHeader = true } = {}) {
  const likeImage = post.isLiked ? 'like-active.svg' : 'like-not-active.svg';
  const currentUser = getUserFromLocalStorage();
  const canDelete =
    !!currentUser && String(currentUser.id) === String(post.user.id);

  const headerHtml = showHeader
    ? `
      <div class="post-header" data-user-id="${escapeHtml(post.user.id)}">
        <img src="${escapeHtml(post.user.imageUrl)}" class="post-header__user-image">
        <p class="post-header__user-name">${escapeHtml(post.user.name)}</p>
      </div>
    `
    : '';

  const deleteButtonHtml = canDelete
    ? `<button class="post-delete-button button secondary-button" data-post-id="${escapeHtml(
        post.id
      )}">Удалить</button>`
    : '';

  return `
    <li class="post" data-post-id="${escapeHtml(post.id)}">
      ${headerHtml}
      <div class="post-image-container">
        <img class="post-image" src="${escapeHtml(post.imageUrl)}">
      </div>
      <div class="post-likes">
        <button data-post-id="${escapeHtml(post.id)}" class="like-button">
          <img src="./assets/images/${likeImage}">
        </button>
        <p class="post-likes-text">
          Нравится: <strong>${post.likes.length}</strong>
        </p>
        ${deleteButtonHtml}
      </div>
      <p class="post-text">
        <span class="user-name">${escapeHtml(post.user.name)}</span>
        ${escapeHtml(post.description)}
      </p>
      <p class="post-date">
        ${format(post.createdAt)}
      </p>
    </li>
  `;
}

function bindPostEvents(container) {
  for (const userEl of container.querySelectorAll('.post-header')) {
    userEl.addEventListener('click', () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  for (const likeEl of container.querySelectorAll('.like-button')) {
    likeEl.addEventListener('click', (event) => {
      toLike(event.currentTarget);
    });
  }

  for (const deleteEl of container.querySelectorAll('.post-delete-button')) {
    deleteEl.addEventListener('click', (event) => {
      removePost(event.currentTarget.dataset.postId);
    });
  }
}

export function renderPostsPageComponent({ appEl }) {
  const container = document.createElement('div');
  container.classList.add('page-container');

  const headerContainer = document.createElement('div');
  headerContainer.classList.add('header-container');

  const postsContainer = document.createElement('ul');
  postsContainer.classList.add('posts');

  postsContainer.innerHTML = posts
    .map((post) => renderPostTemplate(post, { showHeader: true }))
    .join('');

  container.append(headerContainer, postsContainer);
  appEl.innerHTML = '';
  appEl.append(container);

  renderHeaderComponent({
    element: container.querySelector('.header-container'),
  });

  bindPostEvents(container);
}

export function renderUserPostsPageComponent({ appEl }) {
  const container = document.createElement('div');
  container.classList.add('page-container');

  const headerContainer = document.createElement('div');
  headerContainer.classList.add('header-container');

  const postsContainer = document.createElement('ul');
  postsContainer.classList.add('posts');

  const firstPost = posts[0];
  const userHeaderHtml = firstPost
    ? `
      <div class="posts-user-header">
        <img
          class="posts-user-header__user-image"
          src="${escapeHtml(firstPost.user.imageUrl)}"
        />
        <p class="posts-user-header__user-name">${escapeHtml(
          firstPost.user.name
        )}</p>
      </div>
    `
    : '';

  postsContainer.innerHTML =
    userHeaderHtml +
    posts
      .map((post) => renderPostTemplate(post, { showHeader: false }))
      .join('');

  container.append(headerContainer, postsContainer);
  appEl.innerHTML = '';
  appEl.append(container);

  renderHeaderComponent({
    element: container.querySelector('.header-container'),
  });

  bindPostEvents(container);
}
