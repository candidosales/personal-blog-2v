export function checkMultipleTabs(blockUser: boolean): void {
    const channel = new BroadcastChannel('tab-candido-cup');
    let isPrimaryTab = true;

    channel.onmessage = function (event) {
      if (event.data === 'new-tab') {
        alert('Multiplas abas não são permitidas para votação');
        isPrimaryTab = false;
        blockUser = true;
      }
    };

    window.addEventListener('load', () => {
      channel.postMessage('new-tab');
    });

    window.addEventListener('unload', () => {
      if (isPrimaryTab) {
        channel.postMessage('tab-closed');
      }
    });
  }