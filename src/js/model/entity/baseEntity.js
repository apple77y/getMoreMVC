/**
 * 모델 생성자 정의
 * @returns {*}
 * @constructor
 */
nts.model.BaseEntity = function () {
    this._data = [];
};

/**
 * 모델 객체의 프로토타입 정의
 */
nts.model.BaseEntity.prototype = {

    /**
     * 데이터를 호출
     * @returns {Object}
     * @public
     */
    get localData() {
        return this._data;
    },

    /**
     * 데이터에 값을 저장
     * @param {Object} data dao 객체에서 보낸 데이터
     * @public
     */
    set localData(data) {
        this._data = data;

        // 방어 코드
        if (this.dispatchEvent) {
            this.dispatchEvent('update');
        }
    }
};
