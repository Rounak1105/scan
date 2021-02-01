const cameron = document.querySelector("#cameron");

function loadQuagga() {
  if ("mediaDevices" in navigator && navigator.mediaDevices.getUserMedia) {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: cameron,
          numOfWorkers: navigator.hardwareConcurrency, // Or '#yourElement' (optional)
          constraints: {
            width: window.screen.height,
            height: window.screen.width,
            facingMode: "environment",
          },
        },
        decoder: {
          readers: [
            "code_128_reader",
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader",
          ],
          locate: true,
          debug: {
            showCanvas: true,
            showPatches: true,
            showFoundPatches: true,
            showSkeleton: true,
            showLabels: true,
            showPatchLabels: true,
            showRemainingPatchLabels: true,
            boxFromPatches: {
              showTransformed: true,
              showTransformedBox: true,
              showBB: true,
            },
          },
        },
      },
      function (err) {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
      }
    );

    Quagga.onProcessed(function (result) {
      var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute("width")),
            parseInt(drawingCanvas.getAttribute("height"))
          );
          result.boxes
            .filter(function (box) {
              return box !== result.box;
            })
            .forEach(function (box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: "green",
                lineWidth: 2,
              });
            });
        }

        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: "#00F",
            lineWidth: 2,
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          );
        }
      }
    });

    Quagga.onDetected(function (result) {
      console.log(
        "Barcode detected and processed : [" + result.codeResult.code + "]",
        result
      );
      document.getElementById("fname").value=content;
      var x = document.getElementsByClassName("form_class");
      x[0].submit(); // Form submission
    });
  }
}

loadQuagga();