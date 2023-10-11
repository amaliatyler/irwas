const modals = () => {
    function bindModal(triggerSelector, modalSelector, closeSelector, closeClickOverlay = true) {

        const trigger = document.querySelectorAll(triggerSelector),
              modal = document.querySelector(modalSelector),
              close = document.querySelector(closeSelector),
              windows = document.querySelectorAll('[data-modal]');

        trigger.forEach(item => {
            item.addEventListener('click', (event) => {
                if(event.target) {
                    event.preventDefault();
                }
                // во избежание багов закрываем все модальные окна 
                windows.forEach(item => {
                    item.style.display = "none";
                })
    
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                // document.body.classList.add('modal-open');
            });
        });

        close.addEventListener('click', () => {
            // во избежание багов закрываем все модальные окна 
            windows.forEach(item => {
                item.style.display = "none";
            })

            modal.style.display = 'none';
            document.body.style.overflow = '';
            // document.body.classList.remove('modal-open');
        })

        modal.addEventListener('click', (event) => {
            // если пользователь кликнул на подложку и если closeClickOverlay в true 
            if(event.target === modal && closeClickOverlay) {
                // во избежание багов закрываем все модальные окна 
                windows.forEach(item => {
                    item.style.display = "none";
                })

                modal.style.display = 'none';
                document.body.style.overflow = '';
                // document.body.classList.remove('modal-open');
            }
        })
    }

    function showModalByTime(selector, time) {
        setTimeout(function() {
            document.querySelector(selector).style.display = 'block';
            document.body.style.overflow = 'hidden';
        }, time);
    }

    bindModal('.popup_engineer_btn', '.popup_engineer', '.popup_engineer .popup_close');
    bindModal('.phone_link', '.popup', '.popup_close');
    bindModal('.popup_calc_btn', '.popup_calc', '.popup_calc_close');
    // передаем false начиная со второго окна, чтобы оно не закрылось, если пользователь 
    // случайно кликнул на подложку после того, как заполнил предыдущее окно
    bindModal('.popup_calc_button', '.popup_calc_profile', '.popup_calc_profile_close', false);
    bindModal('.popup_calc_profile_button', '.popup_calc_end', '.popup_calc_end_close', false);
    // showModalByTime('.popup', 60000);
};

export default modals;