import {ModuleBuilder} from '@src/modules/common/READ_WORDS/ModuleBuilder';

import pencilWord from './pencil.wav';
import eraserWord from './eraser.wav';
import schoolWord from './school.wav';
import teacherWord from './teacher.wav';
import studentsWord from './students.wav';
import deskWord from './desk.wav';
import paperWord from './paper.wav';
import readingWord from './reading.wav';
import writingWord from './writing.wav';
import mathWord from './math.wav';
import computersWord from './computers.wav';
import learningWord from './learning.wav';

export default ModuleBuilder({
  variants: [{
    word: 'pencil',
    sounds: [[0, 'p'], [1, 'eShort'], [2, 'n'], [3, 's'], [4, 'iShort'], [5, 'l']],
    spoken: pencilWord,
  }, {
    word: 'eraser',
    sounds: [[0, 'eLong'], [1, 'r'], [2, 'aLong'], [3, 's'], [4, 'schwa'], [5, 'r']],
    spoken: eraserWord,
  }, {
    word: 'school',
    sounds: [[0, 's'], [1, 'k'], [3, 'uLongBlue'], [5, 'l']],
    spoken: schoolWord,
  }, {
    word: 'teacher',
    sounds: [[0, 't'], [1, 'eLong'], [3, 'ch'], [5, 'schwa'], [6, 'r']],
    spoken: teacherWord,
  }, {
    word: 'students',
    sounds: [[0, 's'], [1, 't'], [2, 'uLongBlue'], [3, 'd'], [4, 'eShort'], [5, 'n'], [6, 't'], [7, 's']],
    spoken: studentsWord,
  }, {
    word: 'desk',
    sounds: [[0, 'd'], [1, 'eShort'], [2, 's'], [3, 'k']],
    spoken: deskWord,
  }, {
    word: 'paper',
    sounds: [[0, 'p'], [1, 'aLong'], [2, 'p'], [3, 'schwa'], [4, 'r']],
    spoken: paperWord,
  }, {
    word: 'reading',
    sounds: [[0, 'r'], [1, 'eLong'], [3, 'd'], [4, 'iShort'], [5, 'n'], [6, 'gHard']],
    spoken: readingWord,
  }, {
    word: 'writing',
    sounds: [[0, 'r'], [2, 'iLong'], [3, 't'], [4, 'iShort'], [5, 'n'], [6, 'gHard']],
    spoken: writingWord,
  }, {
    word: 'math',
    sounds: [[0, 'm'], [1, 'aShortAt'], [2, 'thThink']],
    spoken: mathWord,
  }, {
    word: 'computers',
    sounds: [[0, 'k'], [1, 'schwa'], [2, 'm'], [3, 'p'], [4, 'uLongMute'], [5, 't'], [6, 'schwa'], [7, 'r'], [8, 's']],
    spoken: computersWord,
  }, {
    word: 'learning',
    sounds: [[0, 'l'], [1, 'schwa'], [3, 'r'], [4, 'n'], [5, 'iShort'], [6, 'n'], [7, 'gHard']],
    spoken: learningWord,
  }],
});

