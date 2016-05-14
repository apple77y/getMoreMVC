/**
 * 모델 생성자 정의
 * @extends nts.model.BaseEntity
 * @returns {*}
 * @constructor
 */
nts.model.AutoScrollEntity = function () {
    // 부모 모델의 생성자를 상속
    nts.model.BaseEntity.call(this);
    this._observer = new nts.helper.Observer();
};

/**
 * 부모 모델의 프로토타입을 상속
 * @type {nts.model.BaseEntity}
 */
nts.model.AutoScrollEntity.prototype = Object.create(nts.model.BaseEntity.prototype);
nts.model.AutoScrollEntity.prototype.constructor = nts.model.AutoScrollEntity;

/**
 * 옵저버 객체에 커스텀 이벤트를 등록
 * @param {string} event 커스텀 이벤트 명
 * @param {function} callback 콜백 함수
 * @public
 */
nts.model.AutoScrollEntity.prototype.addEventListener = function (event, callback) {
    this._observer.subscribe(event, callback);
};

/**
 * 옵저버 객체에 있는 커스텀 이벤트를 실행
 * @param {string} event 커스텀 이벤트 명
 * @public
 */
nts.model.AutoScrollEntity.prototype.dispatchEvent = function (event) {
    this._observer.publish(event);
};
