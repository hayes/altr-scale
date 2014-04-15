module.exports = scale

function scale(parts, change) {
  var ranges = JSON.parse(parts[1])
    , dimensions = []
    , prev = []

  var update_range = this.create_part(parts[0], function(domains, ctx) {
    dimensions = new Array(Math.max(domains.length, ranges.length))

    for(var i = 0, l = dimensions.length; i < l; ++i) {
      dimensions[i] = {
          scale: (ranges[i][1] - ranges[i][0]) / (domains[i][1] - domains[i][0])
        , domain_offset: domains[i][0]
        , range_offset: ranges[i][0]
      }
    }

    map(prev)
  })

  return map

  function map(data, ctx) {
    if(ctx) {
      prev = data

      return update_range(data, ctx)
    }

    var out = Array(data.length)

    for(var i = 0, l = data.length; i < l; ++i) {
      out[i] = Array(dimensions)

      for(var j = 0; j < dimensions.length; ++j) {
        out[i][j] = (data[i][j] - dimensions[j].domain_offset) * dimensions[j].scale + dimensions[j].range_offset
      }
    }

    change(out)
  }
}
