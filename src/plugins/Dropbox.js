class DropboxPlugin {
  constructor() {
    this.connect = this.connect.bind(this);
    this.render = this.render.bind(this);
    this.files = [];
    this.currentDir = '/';
  }

  connect(target) {
    this._target = document.getElementById(target);

    this.client = new Dropbox.Client({ key: 'b7dzc9ei5dv5hcv', token: '' });
    this.client.authDriver(new Dropbox.AuthDriver.Redirect());
    this.client.authenticate();

    if (this.client.credentials().token) {
      this.getDirectory();
    }
  }

  authenticate() {

  }

  addFile() {

  }

  getDirectory() {
    return this.client.readdir(this.currentDir, (error, entries, stat, statFiles) => {
      if (error) {
        return showError(error);  // Something went wrong.
      }
      return this.render(statFiles);
    });
  }

  run() {

  }

  render(files) {
    // for each file in the directory, create a list item element
    const elems = files.map((file, i) => {
      const icon = (file.isFolder) ? 'folder' : 'file'
      return `<li data-type="${icon}" data-name="${file.name}"><span>${icon} : </span><span> ${file.name}</span></li>`
    })

    // appends the list items to the target
    this._target.innerHTML = elems.sort().join('');

    if (this.currentDir.length > 1) {
      const parent = document.createElement('LI');
      parent.setAttribute('data-type', 'parent');
      parent.innerHTML = '<span>...</span>';
      this._target.appendChild(parent);
    }

    // add an onClick to each list item
    const fileElems = this._target.querySelectorAll('li');

    Array.prototype.forEach.call(fileElems, element => {
      const type = element.getAttribute('data-type');

      if (type === 'file') {
        element.addEventListener('click', () => {
          this.files.push(element.getAttribute('data-name'));
          console.dir(`files: ${this.files}`);
        });
      } else {
        element.addEventListener('dblclick', () => {
          const length = this.currentDir.split('/').length;

          if (type === 'folder') {
            this.currentDir = `${this.currentDir}${element.getAttribute('data-name')}/`;
          } else if (type === 'parent') {
            this.currentDir = `${this.currentDir.split('/').slice(0, length - 2).join('/')}/`
          }
          console.log(this.currentDir);
          this.getDirectory();
        })
      }
    })
  }
}

export default new DropboxPlugin()