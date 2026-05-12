function initSubmitContact() {
    $('#contactForm').on('submit', function (event) {
        event.preventDefault();

        var $email = $('#email');
        var $successMessage = $('#success-message');
        var $errorMessage = $('#error-message');

        function validateEmail(email) {
            var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(email);
        }

        if (!validateEmail($email.val())) {
            $errorMessage.removeClass('hidden');
            $successMessage.addClass('hidden');

            setTimeout(function () {
                $errorMessage.addClass('hidden');
            }, 3000);

            return;
        } else {
            $errorMessage.addClass('hidden');
            // Submit the form natively so Netlify can capture it
            try {
                event.currentTarget.submit();
            } catch (e) {
                // Fallback: show client-side success and reset
                $successMessage.removeClass('hidden');
                $('#contactForm')[0].reset();
                setTimeout(function () {
                    $successMessage.addClass('hidden');
                }, 3000);
            }
        }
    });
}

function initSubmitNewsletter() {
    $('#newsletterForm').on('submit', function(event) {
        event.preventDefault();

        var $email = $('#newsletter-email');
        var $errorMessage = $('#newsletter-error');
        var $errorText = $email.next('.error-text');

        var isValid = true;

        function validateEmail(email) {
            var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(email);
        }

        if (!$email.val().trim()) {
            $email.addClass('error-border');
            $errorText.removeClass('hidden').text('This field is required');
            isValid = false;
        } else if (!validateEmail($email.val())) {
            $email.addClass('error-border');
            $errorText.text('Invalid email format').removeClass('hidden');
            isValid = false;
        } else {
            $email.removeClass('error-border');
            $errorText.addClass('hidden');
        }

        if (isValid) {
            event.currentTarget.submit();
        } else {
            $errorMessage.removeClass('hidden');
            setTimeout(function() {
                $errorMessage.addClass('hidden');
            }, 3000);
        }
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get('newsletter') === 'success') {
        const $popup = $('#newsletter-popup');
        if ($popup.length === 0) return;

        $popup.removeClass('hidden').attr('aria-hidden', 'false');
        $('body').addClass('no-scroll');

        const closePopup = function() {
            $popup.addClass('hidden').attr('aria-hidden', 'true');
            $('body').removeClass('no-scroll');
            window.history.replaceState({}, '', window.location.pathname);
        };

        $popup.find('.newsletter-popup-close, .newsletter-popup-backdrop').on('click', closePopup);
        setTimeout(closePopup, 4500);
    }
}
