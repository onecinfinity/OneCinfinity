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
            var $form = $(this);
            var $btn = $form.find('button[type="submit"]');
            var originalText = $btn.text();

            var formEl = $form[0];
            var formData = new FormData(formEl);
            // ensure access_key present (contact form uses a different key)
            if (!formData.get('access_key')) {
                formData.append('access_key', 'a252fc8c-7c79-42f2-8172-d3db4cf42173');
            }
            // combine first + last into name for Web3Forms
            var first = formData.get('first-name') || '';
            var last = formData.get('last-name') || '';
            if (!formData.get('name')) {
                var full = (first + ' ' + last).trim();
                if (full) formData.set('name', full);
            }

            $btn.text('Sending...').prop('disabled', true);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            }).then(function(response) {
                return response.json().then(function(data) {
                    if (response.ok) {
                        $successMessage.removeClass('hidden');
                        $('#contactForm')[0].reset();
                        setTimeout(function () {
                            $successMessage.addClass('hidden');
                        }, 3000);
                    } else {
                        $errorMessage.removeClass('hidden');
                        $errorMessage.find('p').text(data.message || 'Form submission failed.');
                        setTimeout(function () {
                            $errorMessage.addClass('hidden');
                        }, 3000);
                    }
                });
            }).catch(function() {
                $errorMessage.removeClass('hidden');
                setTimeout(function () {
                    $errorMessage.addClass('hidden');
                }, 3000);
            }).finally(function() {
                $btn.text(originalText).prop('disabled', false);
            });
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
            var $form = $(this);
            var $btn = $form.find('button[type="submit"]');
            var originalText = $btn.text();

            var formEl = $form[0];
            var formData = new FormData(formEl);
            // map newsletter-email -> email
            formData.set('email', $email.val());
            if (!formData.get('access_key')) {
                formData.append('access_key', '40b3ae4a-52d7-4318-8763-2a40112dbea8');
            }

            $btn.text('Sending...').prop('disabled', true);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            }).then(function(response) {
                return response.json().then(function(data) {
                    if (response.ok) {
                        // Show success popup (same UI as before)
                        const $popup = $('#newsletter-popup');
                        if ($popup.length) {
                            $popup.removeClass('hidden').attr('aria-hidden', 'false');
                            $('body').addClass('no-scroll');

                            const closePopup = function() {
                                $popup.addClass('hidden').attr('aria-hidden', 'true');
                                $('body').removeClass('no-scroll');
                            };

                            $popup.find('.newsletter-popup-close, .newsletter-popup-backdrop').on('click', closePopup);
                            setTimeout(closePopup, 4500);
                        }
                        $form[0].reset();
                    } else {
                        $errorMessage.removeClass('hidden');
                        setTimeout(function() {
                            $errorMessage.addClass('hidden');
                        }, 3000);
                    }
                });
            }).catch(function() {
                $errorMessage.removeClass('hidden');
                setTimeout(function() {
                    $errorMessage.addClass('hidden');
                }, 3000);
            }).finally(function() {
                $btn.text(originalText).prop('disabled', false);
            });
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