$(function() {
  const $openModalButtons = $('.request-loader');
  const $overlay = $('#modal-overlay');
  const $closeModal = $('.my-close');
  const $modalInner = $('.my-modal');

  function closeModal() {
    $overlay.hide();
    $modalInner.empty();
  }

  $openModalButtons.on('click', function() {
      const videoUrl = $(this).attr('data-video');
      $modalInner.empty();

      if (!videoUrl) return;

      // If it's a YouTube/embed link, use iframe fallback
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('youtube')) {
          const $iframe = $('<iframe>', {
              src: videoUrl + (videoUrl.includes('?') ? '&' : '?') + 'autoplay=1',
              allowfullscreen: true
          });
          $modalInner.append($iframe);
      } else {
          // Assume local video file
          const $video = $('<video>', {
              controls: true,
              playsinline: true,
              autoplay: true
          });
          const $source = $('<source>', {
              src: videoUrl,
              type: 'video/mp4'
          });
          $video.append($source);
          $modalInner.append($video);
          // attempt to play
          try { $video.get(0).play(); } catch (e) {}
      }

      $overlay.css('display', 'flex');
  });

  $closeModal.on('click', function() {
      closeModal();
  });

  $overlay.on('click', function(e) {
      if (e.target === this) {
          closeModal();
      }
  });
});