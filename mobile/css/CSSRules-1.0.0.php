<?PHP //v1.0.0
	/* This class is useful so you don't have to update 3-4 rules everytime 
	 * you decide to change a CSS3 property (to support older browsers)
	 *
	 * Usage: <?PHP CSSRules::transition('all','0.2'); ?>
	 */
	class CSSRules{
		//These function should print the rules directly. 
		static public function transition($str_rule, $int_duration){
			$prop = $str_rule.' '.$int_duration.'s';
			echo "transition: $prop; -moz-transition: $prop; -webkit-transition: $prop; -o-transition: $prop;";
		}
		static public function textShadow($h_pos, $v_pos, $radius, $color = 'auto'){
			$prop = $h_pos.' '.$v_pos.' '.$radius.' '.$color;
			echo "text-shadow: $prop; -moz-text-shadow: $prop; -webkit-text-shadow: $prop; -o-text-shadow: $prop;";
		}
		static public function boxShadow($h_pos, $v_pos, $radius, $color = ''){
			$prop = $h_pos.' '.$v_pos.' '.$radius.' '.$color;
			echo "box-shadow: $prop; -moz-box-shadow: $prop; -webkit-box-shadow: $prop; -o-box-shadow: $prop;";
		}
		static public function userSelect($status){
			echo "-moz-user-select: $status; -webkit-user-select: $status; -webkit-user-drag: $status;";
		}
		static public function borderRadius($nw, $ne, $se, $sw){
			$prop = $nw.' '.$ne.' '.$se.' '.$sw;
			echo "border-radius: $prop; -moz-border-radius: $prop; -webkit-border-radius: $prop; -o-border-radius: $prop;";
		}
		
		static public function makeArrow($direction, $color, $size, $sizeSide=-1, $sizeSide2=-1){
			$rules = "width: 0; height: 0;";
	
			if($sizeSide == -1)
				$sizeSide = $size;
			if($sizeSide2 == -1)
				$sizeSide2 = $sizeSide;
				
			if($direction == 'right' || $direction=='left'){
				$visibleSide = ($direction == 'right')? 'left' : 'right';
				$rules .= "	border-top: $sizeSide solid transparent;
							border-bottom: $sizeSide2 solid transparent;
							border-$visibleSide: $size solid $color;";
			}
			else{ //top or bottom
				$visibleSide = ($direction == 'top')? 'bottom' : 'top';
				$rules .= "	border-left: $sizeSide solid transparent;
							border-right: $sizeSide2 solid transparent;
							border-$visibleSide: $size solid $color;";
			}
	
			echo $rules;
		}
	}
?>