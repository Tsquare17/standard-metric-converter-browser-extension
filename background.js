chrome.action.onClicked.addListener(function(tab) {
    console.log('test');
    chrome.scripting.executeScript( {
        target: {tabId: tab.id, allFrames: true},
        files: ['convert.js']
    });
});
