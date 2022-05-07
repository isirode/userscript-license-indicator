// ==UserScript==
// @name        License indicator
// @namespace   https://github.com/isirode
// @match       https://github.com/orgs/*/repositories
// @match       https://github.com/search*
// @match       https://github.com/*
// @grant       none
// @version     1.0
// @author      Onésime Deleham
// @description This userscript allow to indicate strongly wether or not a Github repository is open-source in places where they are listed
// ==/UserScript==

console.log("Starting Github annotation");

setInterval(annotateRepositories, 500);

function annotateRepositories() {
  
  const annotationsAlreadyThere = document.querySelector('.license-indicator');
  if (annotationsAlreadyThere) {
    console.log("Annotations already there");
    return;
  }
  
  if (window.location.href.includes('github.com/search')) {
    annotateRepoListItem();
  } else if (window.location.href.includes('repositories')) {
    annotateBoxRow();
  } else if ((window.location.pathname.match(/\//g) || []).length === 1) {
    annotateBoxRow();
    // TODO : if Github start indicating the license in the Box elements, add them here (top of a user's page)
  } else {
    console.error("unknown url")
    console.log(window.location.pathname)
  }
}

function annotateBoxRow() {
  const nodeList = document.querySelectorAll('.Box-row');

    if (nodeList) {
      for (let i = 0; i < nodeList.length; i++) {
        let licenseNode = nodeList[i].querySelector('.octicon-law');
        if (licenseNode) {
          annotateOpenSource(nodeList[i]);
        } else {
          annotateNotOpenSource(nodeList[i]);
        }
      }
    }
}

function annotateRepoListItem() {
  const nodeList = document.querySelectorAll('.repo-list-item');

  if (!nodeList) {
    return;
  }
  for (let i = 0; i < nodeList.length; i++) {
      let potentialNodes = nodeList[i].querySelectorAll('.mr-3');
      let isOpenSource = false
      if (potentialNodes) {
        for (let j = 0; j < potentialNodes.length; j++) {
          if (isOpenSource) break;

          let text = potentialNodes[j].childNodes[0].nodeValue;
          // Info : Github does not provide class indicators here
          switch (text.trim()) {
            case 'MIT license':
            case 'GPL-3.0 license':
            case 'Apache-2.0 license':
            case 'BSD-3-Clause license':
            case 'CC0-1.0 license':
              isOpenSource = true;
              console.log('OK')
              break;
            default:
              isOpenSource = false;
          }
        }
      }

      if (isOpenSource) {
          annotateOpenSource(nodeList[i]);
      } else {
        annotateNotOpenSource(nodeList[i]);
      }
  }
}

function annotateOpenSource(node) {
  let elem = document.createElement('span')
  elem.classList.add('license-indicator')
  elem.innerHTML += "<strong style='color: green'>open-source</strong>"
  node.prepend(elem)
}

function annotateNotOpenSource(node) {
  let elem = document.createElement('span')
  elem.classList.add('license-indicator')
  elem.innerHTML += "<strong style='color: red'>not open-source</strong>"
  node.prepend(elem)
}
