/**
 * Plugin criado por:
 * Paulo Cezario
 * https://github.com/phscezario
 **/

(function () {
    const isMobile = Boolean(document.body.clientWidth < 600);

    document.querySelectorAll('.my-banner-slider').forEach((banner) => {
        const bannerData = {
            elementHTML: banner,
            height: Number(banner.getAttribute('data-height')),
            children: banner.querySelectorAll('.item'),
            mobileHeight: Number(banner.getAttribute('data-mobile-height')),
            playTime: Number(banner.getAttribute('data-playtime')),
            itemPosition: 0,
        };

        console.log(typeof bannerData.height);

        if (bannerData.playTime === 0 || isNaN(bannerData.playTime)) bannerData.playTime = 10;

        if (bannerData.height === 0 || isNaN(bannerData.height)) bannerData.height = 250;

        bannerData.elementHTML.style.maxHeight = `${bannerData.height}px`;

        bannerData.children.forEach((child) => {
            const imgBg = child.querySelector('.bg');

            child.style.background = `rgba(0, 0, 0, 0) url(${imgBg.getAttribute('src')}) no-repeat center`;

            if (isMobile && bannerData.mobileHeight !== 0 && !isNaN(bannerData.mobileHeight)) {
                bannerData.elementHTML.style.height = `${bannerData.mobileHeight}px`;
                child.style.height = `${bannerData.mobileHeight}px`;
            } else {
                bannerData.elementHTML.style.height = `${bannerData.height}px`;
                child.style.height = `${bannerData.height}px`;
            }

            imgBg.remove(child);
        });

        if (bannerData.children.length > 1) bannerNavWrappers(bannerData);
        else bannerData.children[0].style.opacity = 1;
    });

    // Adiciona captions
    function bannerNavWrappers(banner) {
        const captions = [];
        const wrappers = document.createElement('div');

        wrappers.setAttribute('class', 'nav');
        banner.elementHTML.appendChild(wrappers);

        for (let i = 0; i < banner.children.length; i++) {
            const items = document.createElement('span');
            //items.setAttribute('data-pos', `${i}`);
            wrappers.appendChild(items);
            captions.push(items);
        }

        banner.captions = captions;

        if (!isMobile) bannerNavControles(banner);
        setBanner(banner, 0, 1);
        bannerCaptionListeners(banner);
        BannerTouchSlider(banner);
    }

    // Adiciona Controles
    function bannerNavControles(banner) {
        const left = document.createElement('div');
        const right = document.createElement('div');

        left.setAttribute('class', 'left-arrow');
        right.setAttribute('class', 'right-arrow');

        left.innerHTML = '‹';
        right.innerHTML = '›';

        banner.elementHTML.appendChild(left);
        banner.elementHTML.appendChild(right);

        left.style.marginTop = `-${left.scrollHeight / 2}px`;
        right.style.marginTop = `-${right.scrollHeight / 2}px`;

        // Previvir seleção, nas setas
        left.addEventListener('selectstart', (event) => {
            event.preventDefault();
        });
        right.addEventListener('selectstart', (event) => {
            event.preventDefault();
        });

        left.addEventListener('click', () => bannerLeft(banner));
        right.addEventListener('click', () => bannerRight(banner));
    }

    // Definir banner
    function setBanner(banner, index, old) {
        if (!banner.isChanging) {
            clearTimeout(banner.bannerAutoPlay);

            banner.elementHTML.addEventListener('mouseover', () => {
                clearTimeout(banner.bannerAutoPlay);
            });

            // Define auto play
            banner.bannerAutoPlay = setTimeout(() => {
                return bannerRight(banner);
            }, banner.playTime * 1000);

            banner.elementHTML.addEventListener('mouseleave', () => {
                banner.bannerAutoPlay = setTimeout(() => {
                    return bannerRight(banner);
                }, banner.playTime * 1000);
            });

            // Define que esta em transição
            banner.isChanging = true;
            banner.itemPosition = index;
            banner.children[old].style.zIndex = '0';
            banner.children[old].removeAttribute('rel');
            banner.captions[old].removeAttribute('class');

            banner.children[index].setAttribute('rel', 'active-banner');
            banner.children[index].style.zIndex = 1;
            banner.captions[index].setAttribute('class', 'active');

            setTimeout(() => {
                banner.isChanging = false;
            }, 500);
        }
    }

    // Adicionar Listeners
    function bannerCaptionListeners(banner) {
        for (let i = 0; i < banner.captions.length; i++) {
            banner.captions[i].addEventListener('click', () => {
                const pos = banner.itemPosition;
                if (pos !== i) setBanner(banner, i, pos);
            });
        }
    }

    function bannerLeft(banner) {
        const pos = banner.itemPosition;
        if (pos > 0) return setBanner(banner, pos - 1, pos);
        if (pos === 0) return setBanner(banner, banner.captions.length - 1, pos);
    }

    function bannerRight(banner) {
        const pos = banner.itemPosition;
        if (pos < banner.captions.length - 1) return setBanner(banner, pos + 1, pos);
        if (pos === banner.captions.length - 1) return setBanner(banner, 0, pos);
    }

    // Mouse Slider
    function BannerTouchSlider(banner) {
        let startX;
        let disX;

        if (!isMobile) {
            banner.elementHTML.addEventListener('mousedown', (e) => {
                startX = e.pageX; // Define local do click no eixo X
            });
            banner.elementHTML.addEventListener('mouseup', (e) => {
                disX = startX - e.pageX; // Define distancia wue o click se arrasta
                if (disX < -100) bannerRight(banner);
                if (disX > 100) bannerLeft(banner);
            });
        } else {
            banner.elementHTML.addEventListener('touchstart', (e) => {
                startX = e.changedTouches[0].pageX; // Define local do click no eixo X
            });
            banner.elementHTML.addEventListener('touchend', (e) => {
                disX = startX - e.changedTouches[0].pageX;
                if (disX < -100) bannerRight(banner);
                if (disX > 100) bannerLeft(banner);
            });
        }
    }
})();
