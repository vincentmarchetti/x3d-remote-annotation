

function add_annotation(parent, annotation_dict, identifier, scale){
    // parent : an HTMLElement in the X3DOM scenegraph. The X3DOM nodes which
    // render the annotation will be as a tree rooted in a new child element of parent
    // generatlly parent will be an X3DOM Group or Transform node, and the shape of the
    // object shape being annotated will be an existing child of parent
    
    // annotation_dict : A dictionary object containing, at least, keys for
    // position (array of 3 number), normal (array of 3 numbers), value
    
    // identifier : a string value to be used as the element id of the root of
    // the annotation, will be used to replace the annotation tree with a new one
    
    // scale : optional numeric value, if not provided will be set to 1
    if ( scale === undefined){
        scale = 1.0;
    }
    console.log("in add_annotation for " + identifier);
    var annot_frame = document.createElement('transform')
    var annot_frame_origin = annotation_dict["position"];
    var annot_frame_origin_string = SFVec3f_attr(annot_frame_origin);
    annot_frame.setAttribute('translation', annot_frame_origin_string);
    annot_frame.setAttribute('id', identifier );
    var annot_origin_marker  = document.createElement('shape');
        var sp = document.createElement('sphere');           
        sp.setAttribute('radius', '0.02');
        annot_origin_marker.appendChild(sp);
        
        var ap = document.createElement('appearance');
        var mt = document.createElement('material');
            mt.setAttribute("emissiveColor", "0 1 0");
            mt.setAttribute("diffuseColor", "0 0 0");
            mt.setAttribute("specularColor", "0 0 0");
        ap.appendChild(mt);
        annot_origin_marker.appendChild(ap);
    annot_frame.appendChild( annot_origin_marker );
    
    
    let leaderLength=0.2;
        let leaderDirection = annotation_dict["normal"];
        let leaderStart = new Array(3);
        let leaderEnd   = new Array(3);
    for( let i=0; i < 3; ++i){
        leaderStart[i] = 0.0;
        leaderEnd[i] = leaderDirection[i] * leaderLength;
    }
    
    var leader = document.createElement("shape");
    {
        let ap = document.createElement('appearance');
        let mt = document.createElement('material');
            mt.setAttribute("emissiveColor", "0 1 0");
        let lp = document.createElement('lineproperties');
            lp.setAttribute("linewidthScaleFactor","3");
        ap.appendChild(mt);
        ap.appendChild(lp);
        
        let ls = document.createElement('lineset');
        ls.setAttribute('vertexCount', '2');
            let co = document.createElement('coordinate');
            co.setAttribute('point', MFVec3f_attr([leaderStart, leaderEnd ]));
            ls.appendChild(co);
        leader.appendChild(ap);
        leader.appendChild(ls);        
    }
    annot_frame.appendChild(leader);
    parent.appendChild( annot_frame )

};

function SFVec3f_attr( sfvec ){
    // return XML attribute encoding
    // sfvec an array of 3 numbers
    return  sfvec[0].toString() + " " +
            sfvec[1].toString() + " " +
            sfvec[2].toString();
}

function MFVec3f_attr( mfvec ){
    // return XML attribute enfoding of MFVec3f
    // mfvec is an Array of (length 3 arrays of numbers)
    let rv = "";
    for (let i=0; i < mfvec.length; ++i){
        if (i > 0)
            rv += ", ";
        rv += SFVec3f_attr(mfvec[i]);
    }
    return rv;
}
