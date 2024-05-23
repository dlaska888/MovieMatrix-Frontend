document.querySelectorAll('*').forEach(elem => {
    if (elem.offsetWidth > document.documentElement.offsetWidth) {
        console.log('Problem child: ', elem);
    }
  });