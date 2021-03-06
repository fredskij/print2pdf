$(function() {

    $('.oppskrift').append('<button class="printBtn">PRINT</button');

    $('.printBtn').on('click', function () {

        //var printCssLink =  $('<link rel="stylesheet" type="text/css" href="https://fredskij.github.io/print2pdf/CSS/stylesheet.css"/><link rel="stylesheet" type="text/css" href="CSS/print2pdf.css"/>');
        var printCssLink =  $('<link rel="stylesheet" type="text/css" href="https://fredskij.github.io/print2pdf/CSS/stylesheet_math.css"/><link rel="stylesheet" type="text/css" href="CSS/unibok_style.css"/><link rel="stylesheet" type="text/css" href="CSS/print2pdf.css"/>');
        var oppskriftEl = $('.oppskrift').clone();
        oppskriftEl.find('.printBtn').hide();
        var printFrame = $('<iframe id="printFrame"/>');
        var blockingLayer = $('<div class="blockingLayer"></div>');
        var printerBtn = $('<button class="printerBtn">printer</button>');
        var docraptorBtn = $('<button class="docraptorBtn">docRaptor</button>');
        var jspdfBtn = $('<button class="jspdfBtn">jsPDF</button>');
        var html2canvasBtn = $('<button class="html2canvasBtn">html2canvas</button>');
        var closeFrameBtn = $('<button class="closeFrameBtn">close</button>');

        blockingLayer.appendTo('body');
        printFrame.appendTo('body').contents().find('body').append(oppskriftEl.append(printerBtn).append(docraptorBtn).append(jspdfBtn).append(html2canvasBtn).append(closeFrameBtn));
        printFrame.contents().find('head').append(printCssLink);

        printFrame.css('top', 100);

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
            var cont = $("#printFrame").contents().find('html').clone();
            cont.find('img').remove();
            cont = cont.html();

            doc.fromHTML(
                cont,
                15, 15,
                {'width': 180},
                function (e) {
                    console.log('callback stuff: ', e);
                },
                {top : 25, bottom : 25 }
            );

            doc.output("dataurlnewwindow");
        });


        printFrame.contents().find('.html2canvasBtn').on('click', function (e) {
          var targetElem = $("#printFrame").contents().find('body');

            var options = {
                height: 400,
                width: 400,
                letterRendering: true,
                logging: true
            };


          targetElem.find('svg').each(function(index, node) {

            // magical SVG adjustments
            var fontSize = Math.ceil(parseFloat(getComputedStyle(node).fontSize));
            var mLeft =  7 * parseFloat(node.style.marginLeft);
            var vAlign = Math.round(fontSize * parseFloat(node.style.verticalAlign));

            $(node).removeAttr('style');
            $(node).css({
              'width': '12px',
              'height': '10px',
              'margin-left': mLeft,
              'vertical-align': vAlign
            });
            $(node).find('line').css({
              'fill': 'black',
              'stroke': 'black'
            });
            $(node).attr('height', '10px');
            $(node).attr('width',  '12px');

          }).promise().done(html2canvas(targetElem, options).then(function (canvas) {
              //$(printFrame).contents().find('section').append(canvas);
              var imgData = canvas.toDataURL('image/png');
              var doc = new jsPDF('p', 'mm');
              doc.addImage(imgData, 'PNG', 10, 10);
              doc.save("notater.pdf");
          }));
        });

        printFrame.contents().find('.closeFrameBtn').on('click', function (e) {
            $("#printFrame").remove();
            $(".blockingLayer").remove();
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