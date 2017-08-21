(function(global) {

  var GALogger = (function() {
    /**
     * コンストラクタ
     *
     * @param string options.dir_id ログの出力先フォルダID
     * @param string options.file_name ログファイル名（任意）
     */
    function GALogger(options) {
      this.target_dir = DriveApp.getFolderById(options.dir_id);
      this.file_name = options.file_name || 'galogger.log';
    }

    /**
     * タイムスタンプ取得
     */
    function _getTimestamp() {
      var date = new Date();
      return date.getFullYear() + '-' + ('0'+(date.getMonth() + 1)).slice(-2) + '-' + ('0'+date.getDate()).slice(-2)
      + 'T' + ('0'+date.getHours()).slice(-2) + ':' + ('0'+date.getMinutes()).slice(-2) + ':' + ('0'+date.getSeconds()).slice(-2)
      + '.' + ('00'+date.getMilliseconds()).slice(-3);
    }

    /**
     * ログ出力
     *
     * @param string msg ログテキスト
     */
    GALogger.prototype.log = function(msg) {
      var self = this;
      // 出力先ファイルを取得、なければ新規作成
      var target_doc = null;
      if (self.target_dir.getFilesByName(self.file_name).hasNext()) {
        target_doc = DocumentApp.openById(self.target_dir.getFilesByName(self.file_name).next().getId());
      } else {
        target_doc = DocumentApp.create(self.file_name);
        self.target_dir.addFile(DriveApp.getFileById(target_doc.getId()));
        DriveApp.getRootFolder().removeFile(DriveApp.getFileById(target_doc.getId()));
      }

      // ログ出力
      var text = target_doc.getBody().editAsText();
      text.appendText('[' + _getTimestamp() + '] ' + msg + '\n');
    };
    
    return GALogger;
  })();

  global.GALogger = GALogger;
})(this);
