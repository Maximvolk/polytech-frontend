function setActiveTab(id) {
  // Get current active tab and deactivate it
  var menu = document.getElementById('menu');
  var activeTab = menu.children[0];

  for (const tab of menu.children) {
    if (tab.classList.contains('active')) {
      activeTab = tab;
      break;
    }
  }

  activeTab.classList.remove('active');

  // Make selected tab active
  document.getElementById(id).classList.add('active');

  // Load selected tab html
  document.getElementsByTagName('iframe')[0].src = `${id}/${id}.html`;
}

$(document).ready(function () {
  setActiveTab('1');
});