

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
            mt.setAttribute("emissiveColor", "1 0 0");
        let lp = document.createElement('lineproperties');
            lp.setAttribute("linewidthscalefactor","1");
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
    
    {
        let tr = document.createElement('transform');
        tr.setAttribute('translation', SFVec3f_attr( leaderEnd ));
        let bb1 = document.createElement('billboard');
        bb1.setAttribute("axisOfRotation","1 0 0");
        tr.appendChild(bb1);
        let bb2 = document.createElement('billboard');
        bb2.setAttribute("axisOfRotation","0 1 0");
        bb1.appendChild(bb2);
        tr.appendChild(bb1);
        
        let labelVertices = [
            [0,0,0],
            [0.1, -0.06, 0.0],
            [0.5, -0.06, 0.0],
            [0.5,  0.06, 0.0],
            [0.1,  0.06, 0.0]
        ];
        
        let shp = document.createElement('shape');
        ifs = document.createElement('indexedfaceset');
        ifs.setAttribute("coordIndex" , "0 1 2 3 4" );
        ifs.setAttribute("solid","true");
        let cc = document.createElement('coordinate');
        cc.setAttribute('point', MFVec3f_attr(labelVertices));
        ifs.appendChild(cc);
        shp.appendChild( ifs );
        let ap = document.createElement('appearance');
        let mt = document.createElement('material');
            mt.setAttribute("emissiveColor", "0.9 0.9 0.9");
            mt.setAttribute("diffuseColor", "0.0 0.0 0.0");
            mt.setAttribute("specularColor", "0.0 0.0 0.0");
        ap.appendChild(mt);
        shp.appendChild( ap );
        bb2.appendChild(shp);
        
        let tr2  = document.createElement('transform');
        tr2.setAttribute("translation", "0.2  -0.035  0.01");
        tr2.setAttribute("scale", "0.06  0.06  0.06");
        let shptxt = document.createElement('shape');
        let txt = document.createElement('text');
            txt.setAttribute("justify",'"MIDDLE"');
            txt.setAttribute("string", '"' + annotation_dict["value"] + '"');
        let fnt = document.createElement("fontstyle");
        fnt.setAttribute( "style",'PLAIN' );
        fnt.setAttribute("family",'SERIF' );
        fnt.setAttribute("size","1.5" );
        txt.appendChild(fnt);
        shptxt.appendChild(txt);
        let apt = document.createElement('appearance');
        let mtt = document.createElement('material');
            mtt.setAttribute("emissiveColor", "0.0 0.0 0.0");
            mtt.setAttribute("diffuseColor", "0.0 0.0 0.0");
            mtt.setAttribute("specularColor", "0.0 0.0 0.0");
        apt.appendChild(mtt);
        shptxt.appendChild( apt );
        tr2.appendChild(shptxt);
        bb2.appendChild(tr2);
        
        annot_frame.appendChild(tr);
    }
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
