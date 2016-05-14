/**
 * DAO 생성자 정의
 * @extends nts.model.BaseDao
 * @returns {*}
 * @constructor
 */
nts.model.AutoScrollDao = function (model) {
    // 부모 DAO의 생성자를 상속
    nts.model.BaseDao.call(this);
    this._model = model;
};

/**
 * 부모 DAO의 프로토타입을 상속
 * @type {nts.model.BaseDao}
 */
nts.model.AutoScrollDao.prototype = Object.create(nts.model.BaseDao.prototype);
nts.model.AutoScrollDao.prototype.constructor = nts.model.AutoScrollDao;

/**
 * ajax 통신 호출
 * @public
 */
nts.model.AutoScrollDao.prototype.findAll = function () {
    var me = this,
        url = 'src/json/data.json';

    me.request(url).then(function (data) {
        me._model.localData = data;
    });
};
