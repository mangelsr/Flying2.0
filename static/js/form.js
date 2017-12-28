$(document).ready(function(){

    $('.encontrado').hide();
    $('.no-encontrado').hide();

    $('#enviar').click(function(event){
        event.preventDefault();

        $('.encontrado').hide();
        $('.no-encontrado').hide();
        
        let tipo;
        if ($('#tipo0').is(':checked')){
            tipo = '0';
        } else {
            tipo = '1';
        }

        let data =  {
            origen: $('#origen').val(),
            destino: $('#destino').val(),
            tipo : tipo
        };

        $.ajax({
            url: "/find/",
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify(data, null, '\t'),
            success: function(data){
                console.log(data);
                if (data.length > 0){
                    let tabla = $('#tabla');
                    tabla.empty();
                    for (elem in data){
                        fila = $('<tr>');
                        
                        aerolinea = $('<td>');
                        aero_origen = $('<td>');
                        aero_destino = $('<td>');
                        paradas = $('<td>');
                        
                        aerolinea.append(data[elem]['aerolinea']);
                        aero_origen.append(data[elem]['aero_origen']);
                        aero_destino.append(data[elem]['aero_destino']);
                        paradas.append(data[elem]['paradas']);

                        fila.append(aerolinea);
                        fila.append(aero_origen);
                        fila.append(aero_destino);
                        fila.append(paradas);
                        
                        tabla.append(fila);
                    }
                    $('.encontrado').fadeIn('slow');
                } else {
                    $('.no-encontrado').fadeIn('slow');
                }
            },
            error: function (jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                alert(msg);
            },
        });
    });
});