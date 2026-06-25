function initSubmitContact() {
    $('#contactForm').on('submit', function (event) {
        event.preventDefault();

        var $email = $('#email');

        function validateEmail(email) {
            var pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return pattern.test(email);
        }

        function showContactPopup(type, message) {
            var $popup = type === 'success' ? $('#contact-success-popup') : $('#contact-error-popup');
            if (!$popup.length) return;
            if (message && type === 'error') $popup.find('#contact-error-text').text(message);
            $popup.removeClass('hidden').attr('aria-hidden', 'false');
            $('body').addClass('no-scroll');

            var closePopup = function() {
                $popup.addClass('hidden').attr('aria-hidden', 'true');
                $('body').removeClass('no-scroll');
            };
            $popup.find('.newsletter-popup-close, .newsletter-popup-backdrop').off('click').on('click', closePopup);
            setTimeout(closePopup, type === 'success' ? 5000 : 4000);
        }

        if (!validateEmail($email.val())) {
            showContactPopup('error', 'Please enter a valid email address.');
            return;
        } else {
            var $form = $(this);
            var $btn = $form.find('button[type="submit"]');
            var originalHTML = $btn.html();

            var formEl = $form[0];
            var formData = new FormData(formEl);
            if (!formData.get('access_key')) {
                formData.append('access_key', 'a252fc8c-7c79-42f2-8172-d3db4cf42173');
            }
            var first = formData.get('first-name') || '';
            var last = formData.get('last-name') || '';
            if (!formData.get('name')) {
                var full = (first + ' ' + last).trim();
                if (full) formData.set('name', full);
            }

            $btn.html('Sending...').prop('disabled', true);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            }).then(function(response) {
                return response.json().then(function(data) {
                    if (response.ok) {
                        showContactPopup('success');
                        $('#contactForm')[0].reset();
                    } else {
                        showContactPopup('error', data.message || 'Submission failed. Please try again.');
                    }
                });
            }).catch(function() {
                showContactPopup('error', 'Network error. Please check your connection and try again.');
            }).finally(function() {
                $btn.html(originalHTML).prop('disabled', false);
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
