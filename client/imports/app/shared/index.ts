import { TopNavComponent } from './top-nav/top-nav.component';
import { SidebarLeftComponent } from './sidebar-left/sidebar-left.component';
import { SearchBoxComponent } from './search-box/search-box.component';

import { FilterPipe } from './pipes/filter.pipe';
import { FirstLetterPipe } from './pipes/first-letter.pipe';
import { MyTasksFilterPipe } from './pipes/myTask-filter.pipe';
import { TimeAgoPipe } from '../shared/pipes/time-ago.pipe';
import { TypeFilterPipe } from '../shared/pipes/type-filter.pipe';
import { SortPipe } from '../shared/pipes/sort.pipe';
import { ZeroPadPipe } from '../shared/pipes/zero-pad.pipe';

export const SHARED_DECLARATIONS = [
  TopNavComponent,
  SidebarLeftComponent,
  SearchBoxComponent,
  FilterPipe,
  FirstLetterPipe,
  MyTasksFilterPipe,
  TimeAgoPipe,
  TypeFilterPipe,
  SortPipe,
  ZeroPadPipe
];
