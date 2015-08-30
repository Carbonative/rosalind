const sidebar = [
  {
    name: 'inboundCalls.this',
    icon: 'phone',
    countBadge: 'inboundCalls',
    submenu: [
      { name: 'inboundCalls.thisOpen', link: '/inboundCalls' },
      { name: 'inboundCalls.thisResolved', link: '/inboundCalls/resolved' },
      { name: 'inboundCalls.new', link: '/inboundCalls/new' }
    ]
  },
  {
    name: 'users.this',
    icon: 'user-md',
    submenu: [
      { name: 'users.thisAll', link: '/users' },
      { name: 'users.thisNew', link: '/users/new' }
    ]
  }
];

Template.sidebar.helpers({
  sidebar() { return sidebar; },
  toHtmlId(name) { return TAPi18n.__(name).replace(/[^a-z]/ig, '-').toLowerCase(); }
});

Template.sidebar.events({
  'click .treeview-menu a'() {
    $('body').removeClass('sidebar-open');
  }
});
