import path from 'path';

const SRC_PATH = path.resolve();
const DATA_PATH = path.resolve(SRC_PATH, 'data');
const VIEWS_PATH = path.resolve(SRC_PATH, 'views');

const paths = {
    src: SRC_PATH,
    data: DATA_PATH,
    views: VIEWS_PATH
 
};

export default paths;