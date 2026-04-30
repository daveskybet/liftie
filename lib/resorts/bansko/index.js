export default {
  selector: '.lifts-menu .col-md-8 .row.nospace',
  parse: {
    name: {
      child: '1'
    },
    status: {
      child: '2/0',
      attribute: 'src',
      regex: /\/icons\/(\w+)\.png$/
    }
  }
};
