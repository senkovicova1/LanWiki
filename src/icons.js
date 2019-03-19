import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faCog, faMinusSquare, faTrash, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

export default function loadIcons() {
  library.add(faSearch, faCog, faMinusSquare, faTrash, faSignOutAlt, faSignInAlt);
}
