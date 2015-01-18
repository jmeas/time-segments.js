(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["underscore", "moment"], factory);
  } else if (typeof exports !== "undefined") {
    var _ = require("underscore");
    var moment = require("moment");
    module.exports = factory(_, moment);
  } else {
    root.TimeSegments = factory(root._, root.moment);
  }
})(this, function (_, moment) {
  "use strict";

  var TimeSegments = {

    // Segment an array of events by scale
    segment: function segment(events, scale, options) {
      scale = scale || "weeks";
      options = options || {};
      _.defaults(options, {
        startAttribute: "start",
        endAttribute: "end"
      });
      events = _.chain(events).clone().sortBy(options.startAttribute).value();
      var segments = {};

      // Clone our events so that we're not modifying the original
      // objects. Loop through them, inserting the events into the
      // corresponding segments
      _.each(_.clone(events), function (e) {
        // Calculate the duration of the event; this determines
        // how many segments it will be in
        var startMoment = moment.utc(e[options.startAttribute]).startOf(scale);
        var endMoment = moment.utc(e[options.endAttribute]).endOf(scale).add(1, "milliseconds");

        // For each duration, add the event to the corresponding segment
        var segmentStart;
        for (var i = 0,
            duration = endMoment.diff(startMoment, scale); i < duration; i++) {
          segmentStart = moment.utc(startMoment).add(i, scale).unix();
          if (!segments[segmentStart]) {
            segments[segmentStart] = [];
          }
          segments[segmentStart].push(_.clone(e));
        }
      });
      return segments;
    }
  };




  return TimeSegments;
});
//# sourceMappingURL=time-segments.js.map