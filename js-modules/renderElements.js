import * as sanitizeData from "./sanitizeData.js";
import * as api from "./api.js";

const commentsSection = document.getElementById(`comments`);

const addForm = document.getElementById(`add-form`);
let nameInput = document.getElementById(`name-input`);
let commentInput = document.getElementById(`comment-input`);
let submitButton = document.getElementById(`submit-comment`);

let comments = [];

/**
 * Отрисовка комментариев
 * @return void
 */
export function renderComments(getRemoteData = true) {
    const render = (comments) => {
        commentsSection.innerHTML = comments.map((comment, index) => {
            return `
                <li class="comment" data-id="${comment.id}" data-index="${index}">
                    <div class="comment-header">
                        <div>${comment.author.name}</div>
                        <div>${sanitizeData.getFormatedDate(comment.date)}</div>
                    </div>
                        <div class="comment-body">
                        <div class="comment-text">${comment.text}</div>
                    </div>
                    <div class="comment-footer">
                        <button class="comment-button">Редактировать</button>
                        <div class="likes">
                            <span class="likes-counter">${comment.likes}</span>
                            <button class="like-button ${comment.isLiked ? "-active-like" : ""}"></button>
                        </div>
                    </div>
                </li>`;
        }).join(``);
    }

    if (!getRemoteData) {
        render(comments);

        initCommentLikeListener();
        initCommentStartEditListener();
        initCommentAnswerListener();

        renderAddEditComment();
    } else {
        api.getComments().then((returnedComments) => {
            if (returnedComments === undefined) return;
            render(comments = returnedComments);

            initCommentLikeListener();
            initCommentStartEditListener();
            initCommentAnswerListener();

            renderAddEditComment();
        });
    }
}

/**
 * Отрисовка формы добавления/редактирования комментариев
 *
 * @return void
 * @param isLoading
 * @param name
 * @param comment
 */
export function renderAddEditComment(isLoading = false, name = "", comment = "") {
    if (isLoading) {
        addForm.innerHTML = `
            <div class="add-form-loading">
                <h3>Комментарий добавляется</h3>
                <?xml version="1.0" encoding="utf-8"?>
                    <svg class="loading-image" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                    <g transform="rotate(0 50 50)">
                    <rect x="44" y="21" rx="6" ry="6" width="12" height="12" fill="#bcec30">
                        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2.5s" begin="-2.25s" repeatCount="indefinite"></animate>
                    </rect>
                    </g><g transform="rotate(36 50 50)">
                    <rect x="44" y="21" rx="6" ry="6" width="12" height="12" fill="#bcec30">
                        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2.5s" begin="-2s" repeatCount="indefinite"></animate>
                    </rect>
                    </g><g transform="rotate(72 50 50)">
                    <rect x="44" y="21" rx="6" ry="6" width="12" height="12" fill="#bcec30">
                        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2.5s" begin="-1.75s" repeatCount="indefinite"></animate>
                    </rect>
                    </g><g transform="rotate(108 50 50)">
                    <rect x="44" y="21" rx="6" ry="6" width="12" height="12" fill="#bcec30">
                        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2.5s" begin="-1.5s" repeatCount="indefinite"></animate>
                    </rect>
                    </g><g transform="rotate(144 50 50)">
                    <rect x="44" y="21" rx="6" ry="6" width="12" height="12" fill="#bcec30">
                        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2.5s" begin="-1.25s" repeatCount="indefinite"></animate>
                    </rect>
                    </g><g transform="rotate(180 50 50)">
                    <rect x="44" y="21" rx="6" ry="6" width="12" height="12" fill="#bcec30">
                        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2.5s" begin="-1s" repeatCount="indefinite"></animate>
                    </rect>
                    </g><g transform="rotate(216 50 50)">
                    <rect x="44" y="21" rx="6" ry="6" width="12" height="12" fill="#bcec30">
                        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2.5s" begin="-0.75s" repeatCount="indefinite"></animate>
                    </rect>
                    </g><g transform="rotate(252 50 50)">
                    <rect x="44" y="21" rx="6" ry="6" width="12" height="12" fill="#bcec30">
                        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2.5s" begin="-0.5s" repeatCount="indefinite"></animate>
                    </rect>
                    </g><g transform="rotate(288 50 50)">
                    <rect x="44" y="21" rx="6" ry="6" width="12" height="12" fill="#bcec30">
                        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2.5s" begin="-0.25s" repeatCount="indefinite"></animate>
                    </rect>
                    </g><g transform="rotate(324 50 50)">
                    <rect x="44" y="21" rx="6" ry="6" width="12" height="12" fill="#bcec30">
                        <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="2.5s" begin="0s" repeatCount="indefinite"></animate>
                    </rect>
                    </g>
                    <!-- [ldio] generated by https://loading.io/ --></svg>
            </div> 
        `;
        return;
    }

    addForm.innerHTML = `
            <input id="name-input" type="text" class="add-form-name" placeholder="Введите имя (не менее 3 символов)" />
            <textarea id="comment-input" class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
            <div class="add-form-row">
                <button id="delete-last-comment" class="add-form-button">Удалить последний комментарий</button>
                <button id="submit-comment" class="add-form-button button_disabled" disabled>Написать</button>
            </div>
        `;

    nameInput = document.getElementById(`name-input`);
    commentInput = document.getElementById(`comment-input`);
    submitButton = document.getElementById(`submit-comment`);
    let _deleteLastComment = document.getElementById(`delete-last-comment`);

    nameInput.value = name;
    commentInput.value = comment;

    submitButton.addEventListener(`click`, initAddEditCommentEvent);
    addForm.addEventListener(`keyup`, initAddEditCommentEvent);

    _deleteLastComment.addEventListener(`click`, () => {
        deleteLastComment();
    });

    [nameInput, commentInput].forEach((input) => {
        input.addEventListener(`input`, () => {
            validateCommentForm();
        });

        input.addEventListener(`keyup`, () => {
            validateCommentForm();
        });
    });

    validateCommentForm();
}

/**
 * Обработчик отправки комментариев
 * @param event
 *
 * @return void
 */
function initAddEditCommentEvent(event) {
    if (event.type === "keyup" && (event.key !== "Enter" || !validateCommentForm())) return;
    addComment(nameInput.value, commentInput.value);
}

/**
 * Обработчик лайков комментариев
 * @return void
 */
function initCommentLikeListener() {
    const buttons = document.querySelectorAll(`button.like-button`);

    buttons.forEach((button) => {
        button.addEventListener(`click`, (event) => {
            event.stopPropagation();

            button.classList.add(`-loading-like`);

            const comment = comments[button.closest(`.comment`).dataset.index];

            const delay = (interval = 300) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, interval);
                });
            };

            delay(1500).then(() => {
                comment.likes += comment.isLiked ? -1 : 1;
                comment.isLiked = !comment.isLiked;
                renderComments(false);
            });
        });
    });
}

/**
 * Обработчик редактирования комментариев
 * @return void
 */
function initCommentStartEditListener() {
    const buttons = document.querySelectorAll(`button.comment-button`);

    buttons.forEach((button) => {
        button.addEventListener(`click`, (event) => {
            event.stopPropagation();

            const commentStructure = button.closest(`.comment`);
            const commentObject = comments[commentStructure.dataset.index];

            const newCommentText = document.createElement(`textarea`);
            newCommentText.innerText = commentObject.text;
            newCommentText.setAttribute(`class`, `add-form-text`);
            newCommentText.setAttribute(`rows`, `4`);
            commentStructure.querySelector(`.comment-text`).replaceWith(newCommentText);

            const newButton = document.createElement(`button`);
            newButton.setAttribute(`class`, `comment-button`);
            newButton.innerText = `Сохранить`;
            button.replaceWith(newButton);

            newButton.addEventListener(`click`, (event) => {
                event.stopPropagation();
                if (newCommentText.value === "") return;
                commentObject.text = sanitizeData.sanitizeHTML(newCommentText.value);
                renderComments(false);
            });

            newCommentText.addEventListener(`click`, (event) => {
                event.stopPropagation();
            });

            commentStructure.addEventListener(`keyup`, (event) => {
                event.stopPropagation();

                const newComment = sanitizeData.sanitizeHTML(newCommentText.value);
                if (event.key !== "Enter") {
                    newButton.disabled = newComment === "";
                    return;
                }
                commentObject.text = sanitizeData.sanitizeHTML(newCommentText.value);
                renderComments(false);
            });
        });
    });
}

/**
 * Обработчик комментариев чужого поста
 * @return void
 */
function initCommentAnswerListener() {
    const commentsElements = document.querySelectorAll(`.comment`);
    commentsElements.forEach((comment) => {
        comment.addEventListener(`click`, () => {
            const commentObject = comments[comment.dataset.index];
            let commentText = commentObject.text;
            commentText = commentText
                .replaceAll("<div class='quote'>", "QUOTE_BEGIN")
                .replaceAll("<br>", "QUOTE_NEXT")
                .replaceAll("</div>", "QUOTE_END");
            commentInput.value = `QUOTE_BEGIN${commentObject.author.name}QUOTE_NEXT${commentText}QUOTE_END\n`;
            validateCommentForm();
        });
    });
}

/**
 * Добавить новый комментарий пользователя
 * @param name
 * @param comment
 *
 * @return void
 */
function addComment(name, comment) {
    let clearName = sanitizeData.sanitizeHTML(name);
    let clearComment = sanitizeData.sanitizeHTML(comment);
    clearComment = clearComment
        .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
        .replaceAll("QUOTE_NEXT", "<br>")
        .replaceAll("QUOTE_END", "</div>");

    renderAddEditComment(true);

    api.postComment(clearName, clearComment).then(() => {
        renderAddEditComment(false);
        renderComments();
    }).catch(() => {
        renderAddEditComment(false, name, comment);
    });
}

/**
 * Удалить последний комментарий
 * @return void
 */
function deleteLastComment() {
    comments.pop();
    renderComments(false);
}

/**
 * Валидация формы заполнения комментариев
 * @return boolean
 */
function validateCommentForm() {
    let name = nameInput.value.trim();
    let comment = commentInput.value.trim();

    if (
        name === "" ||
        comment === ""
    ) {
        submitButton.classList.add(`button_disabled`);
        submitButton.disabled = true;
        return false;
    } else {
        submitButton.classList.remove(`button_disabled`);
        submitButton.disabled = false;
        return true;
    }
}