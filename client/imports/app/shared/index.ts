import { TopNavComponent } from './top-nav/top-nav.component';
import { SidebarLeftComponent } from './sidebar-left/sidebar-left.component';
import { SearchBoxComponent } from './search-box/search-box.component';

import { FilterPipe } from './pipes/filter.pipe';
import { FirstLetterPipe } from './pipes/first-letter.pipe';
import { TimeAgoPipe } from '../shared/pipes/time-ago.pipe';
import { SortPipe } from '../shared/pipes/sort.pipe';
import { ZeroPadPipe } from '../shared/pipes/zero-pad.pipe';

export const SHARED_DECLARATIONS = [
  TopNavComponent,
  SidebarLeftComponent,
  SearchBoxComponent,
  FilterPipe,
  FirstLetterPipe,
  TimeAgoPipe,
  SortPipe,
  ZeroPadPipe
];
