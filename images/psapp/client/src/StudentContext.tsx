import React from 'react';

import { StudentDTO } from '../../common/types';

export let StudentContext = React.createContext<StudentDTO | null>(null);
