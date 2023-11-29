class ResponseDto {
  constructor(model) {
    this.id = model.meta("id");
    this.dbId = model.meta("dbId");
    this._found = model.meta("found");
    this._entityType = model.constructor.name;
    this._writable = model.meta("writable");
  }
}

class PublisherDto extends ResponseDto {
  constructor(model) {
    super(model);
    this.article =
      typeof model.article === "string"
        ? model.article
        : new ArticleDto(model.article);
    this.subscribed = !!model.meta("subscribed");
    this.pinned = !!model.meta("pinned");
  }
}

class UserPublisherDto extends ResponseDto {
  constructor(model) {
    super(model);
    this.pinned = model.pinned;
  }
}

class SubscriptionDto extends ResponseDto {
  constructor(model) {
    super(model);
  }
}

class ArticleDto extends ResponseDto {
  constructor(model) {
    super(model);
    this.title = model.title;
    this.ext = model.ext;
  }
}

class BookmarkDto extends ResponseDto {
  constructor(model) {
    super(model);
    this.type = model.type;
    this.title = model.title;
    this.parent = model.parent;
    this.href = model.href;
  }
}

class AudioDto extends ResponseDto {
  constructor(model) {
    super(model);
    this.ext = model.ext;
    this.type = model.meta("type");
    this.title = model.title;
  }
}

class ImageDto extends ResponseDto {
  constructor(model) {
    super(model);
    this.ext = model.ext;
    this.type = model.meta("type");
    this.alt = model.alt;
  }
}

class UploadDto extends ResponseDto {
  constructor(model) {
    super(model);
    this.fileName = model.fileName;
    this.ext = model.ext;
    this.type = model.meta("type");
  }
}

class VideoDto extends ResponseDto {
  constructor(model) {
    super(model);
    this.ext = model.ext;
    this.type = model.meta("type");
    this.title = model.title;
  }
}

module.exports = {
  PublisherDto,
  SubscriptionDto,
  ArticleDto,
  BookmarkDto,
  ImageDto,
  UploadDto,
  AudioDto,
  VideoDto,
  UserPublisherDto,
};
