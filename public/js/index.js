const backdrop = document.getElementById('backdrop');

const onShowSidebar = () => {
  backdrop.classList.add('backdrop--shown');
}

const onHideSidebar = () => {
  backdrop.classList.remove('backdrop--shown');
}