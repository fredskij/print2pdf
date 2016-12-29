$(function() {

    $('.oppskrift').append('<button class="printBtn">PRINT</button');

    $('.printBtn').on('click', function () {

        var printCssLink =  $('<link rel="stylesheet" type="text/css" href="https://fredskij.github.io/print2pdf/CSS/stylesheet.css"/><link rel="stylesheet" type="text/css" href="CSS/print2pdf.css"/>');
        var oppskriftEl = $('.oppskrift').clone();
        oppskriftEl.find('.printBtn').hide();
        var printFrame = $('<iframe id="printFrame"/>');
        var printerBtn = $('<button class="printerBtn">printer</button>');
        var docraptorBtn = $('<button class="docraptorBtn">docRaptor</button>');
        var jspdfBtn = $('<button class="jspdfBtn">jsPDF</button>');
        var html2canvasBtn = $('<button class="html2canvasBtn">html2canvas</button>');
        var closeFrameBtn = $('<button class="closeFrameBtn">close</button>');

        printFrame.appendTo('body').contents().find('body').append(oppskriftEl.append(printerBtn).append(docraptorBtn).append(jspdfBtn).append(html2canvasBtn).append(closeFrameBtn));
        printFrame.contents().find('head').append(printCssLink);

        printFrame.contents().find('.printerBtn').on('click', function () {
            $("#printFrame").get(0).contentWindow.print();
        });

        printFrame.contents().find('.docraptorBtn').on('click', function (e) {
          var raptorData = {
            doc: {
              test: true,
              type: 'pdf',
              document_content: $("#printFrame").contents().find('html').html()
            },
            user_credentials: "YOUR_API_KEY_HERE"
          };

            download("https://docraptor.com/docs", raptorData);
        });


        printFrame.contents().find('.jspdfBtn').on('click', function (e) {
            var doc = new jsPDF();
            var cont = $("#printFrame").contents().find('html').html();

            doc.fromHTML(
                cont, 15, 15, {'width': 180}
            );

            doc.output("dataurlnewwindow");
        });


        printFrame.contents().find('.html2canvasBtn').on('click', function (e) {
            html2canvas($("#printFrame").contents().find('html'), {
                onrendered: function(canvas) {
                    var imgData = canvas.toDataURL('image/png');
                    var doc = new jsPDF('p', 'mm');
                    doc.addImage(imgData, 'PNG', 20, 20);
                    doc.save("oppskrift.pdf");
                }
            });
        });

        printFrame.contents().find('.closeFrameBtn').on('click', function (e) {
            $("#printFrame").remove();
        });

        var download = function(url, data, method){
            //url and data options required
            if( url && data ){
              jQuery('<form style="display: none" id="dr_submission" action="' + url
                     + '" method="' + (method||'post') + '">'
                     + '</form>').appendTo('body');
              //credentials
              jQuery('form#dr_submission').append('<textarea name="user_credentials"></textarea>');
              jQuery('form#dr_submission textarea[name=user_credentials]').val(data.user_credentials);

              //doc values
              for(var key in data.doc) {
                jQuery('form#dr_submission').append('<textarea name="doc['+key+']"></textarea>');
                jQuery('form#dr_submission textarea[name="doc['+key+']"]').val(data.doc[key]);
              }

              //submit the form
              if(confirm("trykk ok for å lage PDF")) {jQuery('form#dr_submission').submit().remove(); }
            };
          };
    });
});