chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "collectElements") {
    // Get all of the elements matching the CSS query
    var elements = document.querySelectorAll(request.query);

    // Alert how many were found
    alert(`Found ${elements.length} elements`);

    // Create a JSON object from them using reduce
    const values = Array.from(elements).reduce(
      (json_object, element, index) => {
        json_object[`element_${index}`] = element.outerHTML;
        return json_object;
      },
      {}
    );

    // Send the JSON object to the console
    console.log(values);

    // Save the elements in Chrome's local storage
    chrome.storage.local.set(values);
  } else if (request.action === "saveElements") {
    // Log all the values currently saved in local storage
    // (returns a promise)
    chrome.storage.local.get().then((values) => {
      console.log(values);
      var valueString = JSON.stringify(values);
      const valueBlob = new Blob([valueString], { type: "application/json" });
      let blobURL = URL.createObjectURL(valueBlob);
      console.log(blobURL);
      chrome.runtime.sendMessage({ action: "downloadBlob", blobURL: blobURL });
    });
  } else if (request.action === "revokeBlob") {
    URL.revokeObjectURL(request.blobURL);
  }
});