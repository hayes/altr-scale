module.exports = {
    list: list
  , value: value
  , dimensions: dimensions
}

function value(parts, change) {
  var range = JSON.parse(parts[1])
    , val

  var update_domain = this.create_part(parts[0], function(domain, ctx) {
    change(scale(val, dimension(domain, range)))
  })

  return function(v, ctx) {
    val = v
    update_domain(ctx)
  }
}

function list(parts, change) {
  var range = JSON.parse(parts[1])
    , vals

  var update_domain = this.create_part(parts[0], function(domain, ctx) {
    var dimension = dimension(domain, range)
      , result = Array(vals.length)

    for(var i = 0, l = vals.length; i < l; ++i) {
      result[i] = scale(vals[i], dimension)
    }

    change(result)
  })

  return function(v, ctx) {
    vals = v
    update_domain(ctx)
  }
}

function dimensions(parts, change) {
  var ranges = JSON.parse(parts[1])
    , vals

  var update_domain = this.create_part(parts[0], function(domains, ctx) {
    var dimensions = new Array(Math.max(domains.length, ranges.length))
      , out = Array(vals.length)

    for(var i = 0, l = dimensions.length; i < l; ++i) {
      dimensions[i] = dimension(domains[i], ranges[i])
    }

    for(var i = 0, l = vals.length; i < l; ++i) {
      out[i] = Array(dimensions.length)

      for(var j = 0, l2 = dimensions.length; j < l2; ++j) {
        out[i][j] = scale(vals[i][j],  dimensions[j])
      }
    }

    change(out)
  })

  return function(v, ctx) {
    vals = v
    update_domain(ctx)
  }
}

function dimension(domain, range) {
  return {
      scale: (range[1] - range[0]) / (domain[1] - domain[0])
    , domain_offset: domain[0]
    , range_offset: range[0]
  }
}

function scale(val, dimension) {
  val -= dimension.domain_offset
  val *= dimension.scale

  return val + dimension.range_offset
}
