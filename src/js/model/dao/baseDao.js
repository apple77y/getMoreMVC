/**
 * DAO 생성자 정의
 * @returns {*}
 * @constructor
 */
nts.model.BaseDao = function () {

};

/**
 * DAO 객체의 프로토타입 정의
 */
nts.model.BaseDao.prototype = {

    /**
     * ajax 통신 호출
     * @public
     */
    request: function (url) {
        return $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                async: false
            })
            .done($.proxy(this._successHandler, this))
            .fail(this._failureHandler);
    },

    /**
     * ajax가 성공했을 때
     * @param {Object} data 받은 데이터
     * @private
     */
    _successHandler: function (data) {
        return data;
    },

    /**
     * ajax가 실패했을 때
     * @param {Object} err 에러 메세지
     * @returns {boolean}
     * @private
     */
    _failureHandler: function (err) {
        if (err) {
            window.alert('에러가 발생했습니다.');
            return false;
        }
    }
};
