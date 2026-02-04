document.addEventListener('DOMContentLoaded', function () {
    function closest(element, selector) {
        if (Element.prototype.closest) {
            return element.closest(selector);
        }
        do {
            if (Element.prototype.matches && element.matches(selector)
                || Element.prototype.msMatchesSelector && element.msMatchesSelector(selector)
                || Element.prototype.webkitMatchesSelector && element.webkitMatchesSelector(selector)) {
                return element;
            }
            element = element.parentElement || element.parentNode;
        } while (element !== null && element.nodeType === 1);
        return null;
    }

    // social share popups
    Array.prototype.forEach.call(document.querySelectorAll('.share a'), function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            window.open(this.href, '', 'height = 500, width = 500');
        });
    });

    // In some cases we should preserve focus after page reload
    function saveFocus() {
        var activeElementId = document.activeElement.getAttribute("id");
        sessionStorage.setItem('returnFocusTo', '#' + activeElementId);
    }

    var returnFocusTo = sessionStorage.getItem('returnFocusTo');
    if (returnFocusTo) {
        sessionStorage.removeItem('returnFocusTo');
        var returnFocusToEl = document.querySelector(returnFocusTo);
        returnFocusToEl && returnFocusToEl.focus && returnFocusToEl.focus();
    }

    // show form controls when the textarea receives focus or backbutton is used and value exists
    var commentContainerTextarea = document.querySelector('.comment-container textarea'),
        commentContainerFormControls = document.querySelector('.comment-form-controls, .comment-ccs');

    if (commentContainerTextarea) {
        commentContainerTextarea.addEventListener('focus', function focusCommentContainerTextarea() {
            commentContainerFormControls.style.display = 'block';
            commentContainerTextarea.removeEventListener('focus', focusCommentContainerTextarea);
        });

        if (commentContainerTextarea.value !== '') {
            commentContainerFormControls.style.display = 'block';
        }
    }

    // Expand Request comment form when Add to conversation is clicked
    var showRequestCommentContainerTrigger = document.querySelector('.request-container .comment-container .comment-show-container'),
        requestCommentFields = document.querySelectorAll('.request-container .comment-container .comment-fields'),
        requestCommentSubmit = document.querySelector('.request-container .comment-container .request-submit-comment');

    if (showRequestCommentContainerTrigger) {
        showRequestCommentContainerTrigger.addEventListener('click', function () {
            showRequestCommentContainerTrigger.style.display = 'none';
            Array.prototype.forEach.call(requestCommentFields, function (e) {
                e.style.display = 'block';
            });
            requestCommentSubmit.style.display = 'inline-block';

            if (commentContainerTextarea) {
                commentContainerTextarea.focus();
            }
        });
    }

    // Mark as solved button
    var requestMarkAsSolvedButton = document.querySelector('.request-container .mark-as-solved:not([data-disabled])'),
        requestMarkAsSolvedCheckbox = document.querySelector('.request-container .comment-container input[type=checkbox]'),
        requestCommentSubmitButton = document.querySelector('.request-container .comment-container input[type=submit]');

    if (requestMarkAsSolvedButton) {
        requestMarkAsSolvedButton.addEventListener('click', function () {
            requestMarkAsSolvedCheckbox.setAttribute('checked', true);
            requestCommentSubmitButton.disabled = true;
            this.setAttribute('data-disabled', true);
            // Element.closest is not supported in IE11
            closest(this, 'form').submit();
        });
    }

    // Change Mark as solved text according to whether comment is filled
    var requestCommentTextarea = document.querySelector('.request-container .comment-container textarea');

    if (requestCommentTextarea) {
        requestCommentTextarea.addEventListener('input', function () {
            if (requestCommentTextarea.value === '') {
                if (requestMarkAsSolvedButton) {
                    requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-translation');
                }
                requestCommentSubmitButton.disabled = true;
            } else {
                if (requestMarkAsSolvedButton) {
                    requestMarkAsSolvedButton.innerText = requestMarkAsSolvedButton.getAttribute('data-solve-and-submit-translation');
                }
                requestCommentSubmitButton.disabled = false;
            }
        });
    }

    // Disable submit button if textarea is empty
    if (requestCommentTextarea && requestCommentTextarea.value === '') {
        requestCommentSubmitButton.disabled = true;
    }

    // Submit requests filter form on status or organization change in the request list page
    Array.prototype.forEach.call(document.querySelectorAll('#request-status-select, #request-organization-select'), function (el) {
        el.addEventListener('change', function (e) {
            e.stopPropagation();
            saveFocus();
            closest(this, 'form').submit();
        });
    });

    // Submit requests filter form on search in the request list page
    var quickSearch = document.querySelector('#quick-search');
    quickSearch && quickSearch.addEventListener('keyup', function (e) {
        if (e.keyCode === 13) { // Enter key
            e.stopPropagation();
            saveFocus();
            closest(this, 'form').submit();
        }
    });

    function toggleNavigation(toggle, menu) {
        var isExpanded = menu.getAttribute('aria-expanded') === 'true';
        menu.setAttribute('aria-expanded', !isExpanded);
        toggle.setAttribute('aria-expanded', !isExpanded);
    }

    function closeNavigation(toggle, menu) {
        menu.setAttribute('aria-expanded', false);
        toggle.setAttribute('aria-expanded', false);
        toggle.focus();
    }

    var burgerMenu = document.querySelector('.header .menu-button');
    var userMenu = document.querySelector('#user-nav');

    burgerMenu.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleNavigation(this, userMenu);
    });


    userMenu.addEventListener('keyup', function (e) {
        if (e.keyCode === 27) { // Escape key
            e.stopPropagation();
            closeNavigation(burgerMenu, this);
        }
    });

    if (userMenu.children.length === 0) {
        burgerMenu.style.display = 'none';
    }

    // Toggles expanded aria to collapsible elements
    var collapsible = document.querySelectorAll('.collapsible-nav, .collapsible-sidebar');

    Array.prototype.forEach.call(collapsible, function (el) {
        var toggle = el.querySelector('.collapsible-nav-toggle, .collapsible-sidebar-toggle');

        el.addEventListener('click', function (e) {
            toggleNavigation(toggle, this);
        });

        el.addEventListener('keyup', function (e) {
            if (e.keyCode === 27) { // Escape key
                closeNavigation(toggle, this);
            }
        });
    });

    // Submit organization form in the request page
    var requestOrganisationSelect = document.querySelector('#request-organization select');

    if (requestOrganisationSelect) {
        requestOrganisationSelect.addEventListener('change', function () {
            closest(this, 'form').submit();
        });
    }

    // If a section has more than 6 subsections, we collapse the list, and show a trigger to display them all
    const seeAllTrigger = document.querySelector("#see-all-sections-trigger");
    const subsectionsList = document.querySelector(".section-list");

    if (subsectionsList && subsectionsList.children.length > 6) {
        seeAllTrigger.setAttribute("aria-hidden", false);

        seeAllTrigger.addEventListener("click", function (e) {
            subsectionsList.classList.remove("section-list--collapsed");
            seeAllTrigger.parentNode.removeChild(seeAllTrigger);
        });
    }

    // If multibrand search has more than 5 help centers or categories collapse the list
    const multibrandFilterLists = document.querySelectorAll(".multibrand-filter-list");
    Array.prototype.forEach.call(multibrandFilterLists, function (filter) {
        if (filter.children.length > 6) {
            // Display the show more button
            var trigger = filter.querySelector(".see-all-filters");
            trigger.setAttribute("aria-hidden", false);

            // Add event handler for click
            trigger.addEventListener("click", function (e) {
                e.stopPropagation();
                trigger.parentNode.removeChild(trigger);
                filter.classList.remove("multibrand-filter-list--collapsed")
            })
        }
    });
});

// CUSTOM JS ////////////////////////////////////////

$(document).ready(function () {

    // Copy code button for pre blocks
    document.querySelectorAll('.article-body pre, .comment-body pre, .post-body pre').forEach(function(pre) {
        var wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);

        var button = document.createElement('button');
        button.className = 'copy-code-button';
        button.type = 'button';
        button.setAttribute('aria-label', 'Copiar código');
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

        button.addEventListener('click', function() {
            var code = pre.querySelector('code') ? pre.querySelector('code').textContent : pre.textContent;
            navigator.clipboard.writeText(code).then(function() {
                button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                button.classList.add('copied');
                setTimeout(function() {
                    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                    button.classList.remove('copied');
                }, 2000);
            });
        });

        wrapper.appendChild(button);
    });

    // Scroll to anchor (usando delegación para elementos dinámicos)
    function scrollToAnchor(dest) {
        $('html, body').animate({
            scrollTop: $(dest).offset().top - 100
        }, 1000, 'swing');
    }

    $(document).on('click', 'a[href^="#"]:not(.heading-anchor)', function(e) {
        e.preventDefault();
        var dest = $(this).attr('href');
        scrollToAnchor(dest);
    });

    // Heading anchor links
    var headings = document.querySelectorAll('.article-body h1, .article-body h2, .article-body h3, .article-body h4, .article-body h5, .article-body h6');

    headings.forEach(function(heading) {
        // Create id from heading text if not exists
        if (!heading.id) {
            heading.id = heading.textContent.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        }

        var link = document.createElement('a');
        link.className = 'heading-anchor';
        link.href = '#' + heading.id;
        link.setAttribute('aria-label', 'Copiar enlace a esta sección');
        link.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';

        link.addEventListener('click', function(e) {
            e.preventDefault();
            var url = window.location.href.split('#')[0] + '#' + heading.id;
            navigator.clipboard.writeText(url).then(function() {
                link.classList.add('copied');
                setTimeout(function() {
                    link.classList.remove('copied');
                }, 2000);
            });
        });

        heading.appendChild(link);
    });

    // Auto-generate table of contents and move to sidebar on desktop
    var articleBody = document.querySelector('.article-body');
    var articleSidebar = document.querySelector('.article-sidebar');
    var existingIndex = document.querySelector('.article-body .content-index');

    if (articleBody && articleSidebar) {
        var toc = null;

        // Detectar idioma desde la URL (ej: /hc/es/articles/... o /hc/en-us/articles/...)
        var pathParts = window.location.pathname.split('/');
        var locale = pathParts[2] || 'es';
        var tocTitle = locale.startsWith('en') ? 'Table of contents' : 'Índice de contenidos';

        if (existingIndex) {
            // Si ya existe un índice manual, lo usamos
            toc = existingIndex;

            // Verificar si tiene título, si no lo tiene, añadirlo
            var firstChild = toc.firstElementChild;
            var hasTitle = firstChild && firstChild.tagName === 'P' && !firstChild.querySelector('a');
            if (!hasTitle) {
                var titleP = document.createElement('p');
                titleP.textContent = tocTitle;
                toc.insertBefore(titleP, toc.firstChild);
            }
        } else {
            // Si no existe, lo generamos desde los H2
            var h2Headings = document.querySelectorAll('.article-body h2');

            if (h2Headings.length >= 3) {
                toc = document.createElement('div');
                toc.className = 'content-index';

                var tocHTML = '<p>' + tocTitle + '</p>';
                h2Headings.forEach(function(h2, index) {
                    tocHTML += '<p><a href="#' + h2.id + '">' + (index + 1) + '. ' + h2.textContent.replace(/\s*$/, '') + '</a></p>';
                });

                toc.innerHTML = tocHTML;
            }
        }

        if (toc) {
            // Crear contenedor para el sidebar
            var sidebarToc = document.createElement('div');
            sidebarToc.className = 'sidebar-toc';
            sidebarToc.appendChild(toc.cloneNode(true));

            // Insertar al principio del sidebar
            articleSidebar.insertBefore(sidebarToc, articleSidebar.firstChild);

            // Si el índice no existía en el body, lo añadimos también (para móvil)
            if (!existingIndex) {
                articleBody.insertBefore(toc, articleBody.firstChild);
            }

            // Marcar el índice del body para ocultarlo en desktop
            toc.classList.add('content-index--body');

            // Highlight current section in sidebar TOC on scroll
            var tocLinks = sidebarToc.querySelectorAll('a[href^="#"]');
            var headingIds = [];
            tocLinks.forEach(function(link) {
                var id = link.getAttribute('href').substring(1);
                if (id) headingIds.push(id);
            });

            function highlightCurrentSection() {
                var scrollPos = window.scrollY + 150;
                var currentId = null;

                headingIds.forEach(function(id) {
                    var heading = document.getElementById(id);
                    if (heading && heading.offsetTop <= scrollPos) {
                        currentId = id;
                    }
                });

                tocLinks.forEach(function(link) {
                    var linkId = link.getAttribute('href').substring(1);
                    if (linkId === currentId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }

            window.addEventListener('scroll', highlightCurrentSection);
            highlightCurrentSection();
        }
    }

    // Back to top button
    var backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.type = 'button';
    backToTopButton.setAttribute('aria-label', 'Volver arriba');
    backToTopButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
    document.body.appendChild(backToTopButton);

    // Centrar el botón respecto al artículo y detenerlo antes del footer
    var articleElement = document.querySelector('article.article');
    var footerElement = document.querySelector('footer.footer');
    var buttonHeight = 44;
    var buttonMargin = 30;

    function positionBackToTop() {
        if (articleElement) {
            var rect = articleElement.getBoundingClientRect();
            var centerX = rect.left + (rect.width / 2);
            backToTopButton.style.left = centerX + 'px';

            // Calcular si el botón debe detenerse antes del footer
            var stopPoint = footerElement ? footerElement.offsetTop : (articleElement.offsetTop + articleElement.offsetHeight);
            var scrollTop = window.scrollY;
            var windowHeight = window.innerHeight;
            var buttonFixedBottom = scrollTop + windowHeight - buttonMargin;

            if (buttonFixedBottom > stopPoint - buttonHeight + 10) {
                // El botón llegaría al footer, lo detenemos
                backToTopButton.style.position = 'absolute';
                backToTopButton.style.bottom = 'auto';
                backToTopButton.style.top = (stopPoint - buttonHeight - buttonMargin + 10) + 'px';
            } else {
                // El botón puede seguir fijo
                backToTopButton.style.position = 'fixed';
                backToTopButton.style.bottom = buttonMargin + 'px';
                backToTopButton.style.top = 'auto';
            }
        }
    }
    positionBackToTop();
    window.addEventListener('resize', positionBackToTop);
    window.addEventListener('scroll', positionBackToTop);

    backToTopButton.addEventListener('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 500, 'swing');
    });

    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

});


// SHOW ALL ARTICLES IN CATEGORY PAGE - Auto load all articles

$(document).ready(function(){

    var hc_url = 'https://ayuda.easymailing.com';

    // Find all "see all articles" links and load all articles automatically
    $('.see-all-articles').each(function() {
        var $link = $(this);
        var $container = $link.closest('.see-all-articles-container');
        var $section = $link.closest('.section');
        var $articleList = $section.find('ul.article-list');

        var href = $link.attr('href');
        if (!href) return;

        var sectionId = href.split('/sections/')[1];
        if (sectionId) {
            sectionId = sectionId.split('-')[0];
        } else {
            return;
        }

        var locale = 'es';
        if (typeof HelpCenter !== 'undefined' && HelpCenter.user && HelpCenter.user.locale) {
            locale = HelpCenter.user.locale;
        } else {
            var pathParts = window.location.pathname.split('/');
            if (pathParts[2]) locale = pathParts[2];
        }

        var apiUrl = hc_url + '/api/v2/help_center/' + locale + '/sections/' + sectionId + '/articles.json?per_page=100';

        // Hide the "see all" button immediately
        $container.hide();

        // Fetch all articles
        $.ajax({
            url: apiUrl,
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                if (data.articles && data.articles.length > 0) {
                    var articlesHtml = '';
                    data.articles.forEach(function(article) {
                        if (!article.draft) {
                            var promotedClass = article.promoted ? 'article-promoted article-list-item' : 'article-list-item';
                            var starIcon = article.promoted ? '<span class="icon-star" data-title="Promoted article"></span>' : '';
                            articlesHtml += '<li class="' + promotedClass + '"><a href="' + article.html_url + '">' + article.title + starIcon + '</a></li>';
                        }
                    });
                    $articleList.html(articlesHtml);
                }
            }
        });
    });

});


// Categories dropdown in header
$(document).ready(function() {
    var $dropdown = $('.categories-dropdown');
    var $toggle = $('.categories-dropdown-toggle');
    var $menu = $('.categories-dropdown-menu');
    var hc_url = 'https://ayuda.easymailing.com';

    // Detect locale from URL
    var pathParts = window.location.pathname.split('/');
    var locale = pathParts[2] || 'es';

    // Load categories via API
    $.ajax({
        url: hc_url + '/api/v2/help_center/' + locale + '/categories.json',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.categories && data.categories.length > 0) {
                var categoriesHtml = '';
                data.categories.forEach(function(category) {
                    categoriesHtml += '<a href="' + category.html_url + '">' + category.name + '</a>';
                });
                $menu.html(categoriesHtml);
            }
        }
    });

    $toggle.on('click', function(e) {
        e.stopPropagation();
        var isExpanded = $dropdown.attr('aria-expanded') === 'true';
        $dropdown.attr('aria-expanded', !isExpanded);
    });

    // Close dropdown when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.categories-dropdown').length) {
            $dropdown.attr('aria-expanded', 'false');
        }
    });

    // Close dropdown on escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            $dropdown.attr('aria-expanded', 'false');
        }
    });
});
