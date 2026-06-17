(function () {
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildCardHtml(service) {
    var id = encodeURIComponent(service.id || "social-media-management");
    var title = escapeHtml(service.pageTitle || "Service");
    var icon = escapeHtml(service.cardIcon || "image/Icon-7.png");
    var description = escapeHtml(service.cardDescription || service.introParagraph || "");

    return [
      '<div class="col">',
      '  <div class="card card-service">',
      '    <div class="d-flex flex-row justify-content-start gspace-2 gspace-md-3 align-items-center">',
      '      <div>',
      '        <div class="service-icon-wrapper">',
      '          <div class="service-icon">',
      '            <img src="' + icon + '" alt="' + title + ' Icon" class="img-fluid">',
      '          </div>',
      '        </div>',
      '      </div>',
      '      <div class="service-title">',
      '        <h4>' + title + '</h4>',
      '      </div>',
      '    </div>',
      '    <p>' + description + '</p>',
      '    <a href="' + id + '/" class="btn btn-accent">',
      '      <div class="btn-title"><span>View Details</span></div>',
      '      <div class="icon-circle"><i class="fa-solid fa-arrow-right"></i></div>',
      '    </a>',
      '  </div>',
      '</div>'
    ].join("");
  }

  function renderServices(services) {
    var grid = document.getElementById("service-cards-grid");
    if (!grid || !Array.isArray(services)) {
      return;
    }

    grid.innerHTML = services.map(buildCardHtml).join("");
  }

  async function loadServiceCards() {
    try {
      var response = await fetch("data/services.json");
      if (!response.ok) {
        throw new Error("Failed to fetch services.json");
      }

      var payload = await response.json();
      renderServices(payload.services || []);
    } catch (error) {
      console.error("Service cards load error:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", loadServiceCards);
  window.addEventListener("pageshow", loadServiceCards);
})();
