fetch('data/services.json', { cache: 'no-store' })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var services = data.services.slice(0, 6);
        var grid = document.getElementById('homepage-services-grid');
        
        if (grid) {
            var html = '';
            services.forEach(function(service) {
                html += '<div class="col">';
                html += '  <div class="card card-service">';
                html += '    <div class="d-flex flex-row justify-content-between gspace-2 gspace-md-3 align-items-center">';
                html += '      <div>';
                html += '        <div class="service-icon-wrapper">';
                html += '          <div class="service-icon">';
                html += '            <img src="' + service.cardIcon + '" alt="' + service.pageTitle + ' Icon" class="img-fluid">';
                html += '          </div>';
                html += '        </div>';
                html += '      </div>';
                html += '      <div class="service-title">';
                html += '        <h4>' + service.pageTitle + '</h4>';
                html += '      </div>';
                html += '    </div>';
                html += '    <p>' + service.cardDescription + '</p>';
                html += '    <a href="single_services.html?id=' + service.id + '" class="btn btn-accent">';
                html += '      <div class="btn-title"><span>View Details</span></div>';
                html += '      <div class="icon-circle"><i class="fa-solid fa-arrow-right"></i></div>';
                html += '    </a>';
                html += '  </div>';
                html += '</div>';
            });
            grid.innerHTML = html;
        }
    })
    .catch(function(error) {
        console.error('Error loading services:', error);
    });
