import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import pencilWord from '@src/modules/common/READING/words/pencil';
import eraserWord from '@src/modules/common/READING/words/eraser';
import schoolWord from '@src/modules/common/READING/words/school';
import teacherWord from '@src/modules/common/READING/words/teacher';
import studentsWord from '@src/modules/common/READING/words/students';
import deskWord from '@src/modules/common/READING/words/desk';
import paperWord from '@src/modules/common/READING/words/paper';
import readingWord from '@src/modules/common/READING/words/reading';
import writingWord from '@src/modules/common/READING/words/writing';
import mathWord from '@src/modules/common/READING/words/math';
import computersWord from '@src/modules/common/READING/words/computers';
import learningWord from '@src/modules/common/READING/words/learning';

export default ModuleBuilder({
  variants: [pencilWord, eraserWord, schoolWord, teacherWord, studentsWord, deskWord, paperWord, readingWord, writingWord, mathWord, computersWord, learningWord],
});

